var fs = require('fs');
var execSync = require('child_process').execSync;
var yaml = require('js-yaml');
var httpSync = require('http-sync');

var repoName = process.argv[2];
var branchName = process.argv[3];
if (!repoName || !branchName) {
  throw new Error('Repo ('+repoName+') or branch ('+branchName+') not valid.');
}

var stackName = repoName+'-'+branchName;
var data;

try {
  data = fs.readFileSync('tutum.yml', 'utf8');
  console.log("Using tutum.yml");
}
catch (e) {

}

//try {
//  data = fs.readFileSync('docker-compose.yml', 'utf8');
//  console.log("Using docker-compose.yml");
//}
//catch (e) {
//
//}

if (!data) {
  console.log("Data file not found, using defaults");
  data = defaultConfig();
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

Object.keys(json).forEach(function(containerName) {
  var container = json[containerName];
  if (container.build) {
    console.log('Creating '+stackName+'-'+containerName+' registry...');
    createRegistry(stackName+'-'+containerName);

    console.log('Building '+containerName+'...');
    buildImage(stackName+'-'+containerName, container.build);

    console.log('Tagging '+containerName+'...');
    tagImage(stackName+'-'+containerName);

    console.log('Logging in...');
    dockerLogIn();

    console.log('Pushing '+containerName+'...');
    pushImage(stackName+'-'+containerName);
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
  if (json[service.name] && json[service.name].proxy) {
    for (var j=0; j<service.containers.length; j++) {
      var container = apiCmd('GET', service.containers[j]);
      var ports = container.container_ports;
      for (var k=0; k<ports.length; k++) {
        for (var l=0; l< json[service.name].proxy.length; l++) {
          var proxy = json[service.name].proxy[l].split('.');
          proxy.reverse();
          proxies['upstream.'+proxy.join('.')+':'+ports[k].inner_port] = ports[k].endpoint_uri;
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

function defaultConfig()
{
  var conf = "\
web:\n\
  build: \".\"\n\
  proxy:\n\
    - ${repoName}.${branchName}.cogclient.com\n\
  ports:\n\
    - \"80\"\n\
";

  return conf;
}

function apiCmd(method, uri, body)
{
  var req = httpSync.request({
    "method": method,
    "protocol": "https",
    "host": "dashboard.tutum.co",
    "path": uri,
    "headers": {
      "Authorization": "ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed",
      "User-Agent": "node-request",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  });
  var res = req.end();
  res = JSON.parse(res.body.toString());
  if (res.error) {
    throw new Error(res.error);
  }
  return res;
}

function createRegistry(registryName)
{
  apiCmd('POST', '/api/v1/image/', {
    "name": "tutum.co/happycog/"+registryName
  });
}

function buildImage(containerName, buildPath)
{
  var cmd = 'docker build -t '+containerName+' '+buildPath;
  execSync(cmd);
}

function tagImage(containerName)
{
  var cmd = 'docker tag '+containerName+' tutum.co/happycog/'+containerName;
  execSync(cmd);
}

function dockerLogIn()
{
  var cmd = 'docker login -e dev@happycog.com -u happycog -p hTbuYzrov7kvv4 tutum.co';
  execSync(cmd);
}

function pushImage(containerName)
{
  var cmd = 'docker push tutum.co/happycog/'+containerName;
  execSync(cmd);
}

function checkForStack(serviceName)
{
  var res = apiCmd('GET', '/api/v1/stack/?name='+serviceName);
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

      if (containerKey == 'proxy') {
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
  console.log(def.services.web);
  var res = apiCmd('PATCH', '/api/v1/stack/'+uuid, def);
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
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Content-Type: application/json" -X POST -d \''+body+'\' http://web.cogclient-proxy.happycog.svc.tutum.io:26542/';
  return JSON.parse(execSync(cmd).toString());
}
