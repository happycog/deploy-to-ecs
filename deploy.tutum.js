var fs = require('fs');
var execSync = require('child_process').execSync;
var yaml = require('js-yaml');
var httpSync = require('http-sync');

var repoName = process.argv[2];
var branchName = process.argv[3];
var tagName = process.argv[4];
if (!repoName || !branchName) {
  throw new Error('Repo ('+repoName+') or branch ('+branchName+') not valid.');
}

tagName = tagName ? ':'+tagName : '';

var stackName = repoName+'-'+branchName.replace(/\./g, '-').replace(/\//g, '-');
var data;

try {
  data = fs.readFileSync('docker-compose.yml', 'utf8');
  console.log("Using docker-compose.yml");
}
catch (e) {

}

data = data.replace(/\${repoName}/g, repoName);
data = data.replace(/\${branchName}/g, branchName);

var json;
try {
  json = yaml.safeLoad(data);
}
catch (e) {
  throw e;
}

var loggedIn = false;
Object.keys(json).forEach(function(containerName) {
  var container = json[containerName];
  if (container.build) {
    if (!loggedIn) {
      console.log('Logging in...');
      dockerLogIn();
      loggedIn = true;
    }

    console.log('Creating '+stackName+'-'+containerName+' registry...');
    createRegistry(stackName, containerName);

    console.log('Building '+containerName+'...');
    buildImage(stackName, containerName);

    console.log('Tagging '+containerName+'...');
    tagImage(stackName, containerName, tagName);

    console.log('Pushing '+containerName+'...');
    pushImage(stackName, containerName, tagName);
  }
});

console.log('Checking for exising stack...');
var uuid = checkForStack(stackName);
if (uuid) {
  console.log('Stack found, updating existing stack...');
  updateStack(stackName, uuid, json);
  redeployStack(uuid);
  console.log('  > Update complete.');
}
else {
  console.log('Stack not found, creating new stack...');
  uuid = createStack(stackName, json);
  startStack(uuid);
  console.log('  > Creation complete.');
}

console.log('Waiting for redeploy...');
var stack = waitForStack(uuid);

console.log('Fetching container ports...');
var proxies = {};
for (var i=0; i<stack.services.length; i++) {
  var servicePath = stack.services[i];
  var service = apiCmd('GET', servicePath);
  if (json[service.name] && json[service.name].labels) {
    for (var j=0; j<service.containers.length; j++) {
      var container = apiCmd('GET', service.containers[j]);
      console.log('  > container: '+JSON.stringify(container));
      var ports = container.container_ports;
      for (var k=0; k<ports.length; k++) {
        if (ports[k].endpoint_uri) {
          for (var l=0; l< json[service.name].labels.length; l++) {
            var proxy = json[service.name].labels[l];
            console.log('  > potential proxy: '+proxy);
            if (proxy.substring(0, 9) == 'upstream.') {
              proxies[proxy+':'+ports[k].inner_port] = ports[k].endpoint_uri;
            }
            if (process.env.SLACK_API_URL) {
              runCurl('POST', {"text":"Code was just deployed to "+json[service.name].proxy[l]}, process.env.SLACK_API_URL);
            }
          }
        }
      }
    }
  }
}

console.log('Updating proxy...');
Object.keys(proxies).forEach(function(key) {
  console.log('  - '+key+' => '+proxies[key]);
});
var proxy = updateProxy(proxies);
console.log('Done!');

function apiCmd(method, uri, body)
{
  body = body ? body : '';
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Authorization: ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed" -H "User-Agent: node-request" -H "Content-Type: application/json" -X '+method+' -d \''+body+'\' https://dashboard.tutum.co'+uri;
  var res = execSync(cmd).toString();
  res = JSON.parse(res);
  if (res.error) {
    throw new Error(res.error);
  }
  return res;
}

function runCurl(method, body, url)
{
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Content-Type: application/json" -X '+method+' -d \''+body+'\' '+url;
  return execSync(cmd).toString();
}

function createRegistry(stackName, containerName)
{
  apiCmd('POST', '/api/v1/image/', {
    "name": "tutum.co/happycog/"+stackName+'-'+containerName
  });
}

function buildImage(stackName, containerName)
{
  var projectName = stackName.replace(/-/g, '');
  var cmd = 'COMPOSE_PROJECT_NAME='+stackName+' docker-compose build '+containerName;
  execSync(cmd);
}

function tagImage(stackName, containerName, tagName)
{
  var projectName = stackName.replace(/-/g, '');
  var cmd = 'docker tag '+projectName+'_'+containerName+' tutum.co/happycog/'+stackName+'-'+containerName+tagName;
  execSync(cmd);
}

function dockerLogIn()
{
  var cmd = 'docker login -e dev@happycog.com -u happycog -p hTbuYzrov7kvv4 tutum.co';
  execSync(cmd);
}

function pushImage(stackName, containerName, tagName)
{
  var cmd = 'docker push tutum.co/happycog/'+stackName+'-'+containerName+tagName;
  execSync(cmd);
}

function checkForStack(stackName)
{
  var res = apiCmd('GET', '/api/v1/stack/?name='+stackName);
  for (var i=0; i<res.objects.length; i++) {
    var stack = res.objects[i];
    if (stack.state != 'Terminated') {
      return stack.uuid;
    }
  }

  return false;
}

function defineStack(stackName, stack)
{
  var def = {
    name: stackName,
    services: []
  };

  Object.keys(stack).forEach(function(containerName) {
    var container = stack[containerName];
    var service = {
      "name": containerName
    };

    Object.keys(container).forEach(function(containerKey) {
      if (containerKey == 'build') {
        service.image = 'tutum.co/happycog/'+stackName+'-'+containerName;
        return;
      }

      if (containerKey == 'dockerfile') {
        return;
      }

      service[containerKey] = container[containerKey];
    });

    def.services.push(service);
  });

  return def;
}

function createStack(stackName, stack)
{
  var def = defineStack(stackName, stack);
  var res = apiCmd('POST', '/api/v1/stack/', def);
  return res.uuid;
}

function startStack(uuid)
{
  var res = apiCmd('POST', '/api/v1/stack/'+uuid+'/start/');
  return res;
}

function updateStack(stackName, uuid, stack)
{
  var def = defineStack(stackName, stack);
  delete def.name;
  var res = apiCmd('PATCH', '/api/v1/stack/'+uuid+'/', def);
  return res.uuid;
}

function redeployStack(uuid)
{
  var res = apiCmd('POST', '/api/v1/stack/'+uuid+'/redeploy/');
  return res;
}

function waitForStack(uuid)
{
  while (true) {
    var stack = apiCmd('GET', '/api/v1/stack/'+uuid+'/');
    if (stack.state == 'Running') {
      return stack;
    }
  }
}

function updateProxy(body)
{
  return JSON.parse(runCurl('POST', body, 'http://web.cogclient-proxy.happycog.svc.tutum.io:26542/'));
}
