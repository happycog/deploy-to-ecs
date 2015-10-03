var fs = require('fs');
var execSync = require('child_process').execSync;
yaml = require('js-yaml');

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
  throw new Error('Unable to parse json data: '+data);
}

json.forEach(function(container, containerName) {
  if (container.build) {
    console.log('Building '+containerName+'...');
    buildImage(containerName, container.build);

    console.log('Tagging '+containerName+'...');
    tagImage(containerName);

    console.log('Pushing '+containerName+'...');
    pushImage(containerName);
  }
});

console.log('Checking for exising stack...');
if (checkForStack(stackName)) {
  console.log('Stack found, updating existing stack...');
  updateStack(stackName, json);
  console.log('  > Update complete.');
}
else {
  console.log('Stack not found, creating new stack...');
  createStack(stackName, json);
  console.log('  > Creation complete.');
}

  if (container.hosts) {
    console.log('Waiting for service to become active...');
    waitForService(container.name);
    console.log('Service is now active, querying IP...');
  
    console.log('  > Finding tasks...');
    var serviceTaskArns = getServiceTaskArns(container.name);
  
    console.log('  > Checking port bindings...');
    var bindings = getTaskContainerBindings(serviceTaskArns);
  
    console.log('  > Fetching public IP...');
    var instanceArns = bindings.map(function(binding) { return binding.containerInstanceArn; });
    var ips = getContainerInstanceIps(instanceArns);
  
    console.log('Updating proxy...');
    var proxies = {};
    container.hosts.forEach(function(host) {
      proxies[host] = 'http://'+ips[0].ip+':'+bindings[0].hostPort;
    });
    console.log('  > Updated, ', updateProxy(proxies));
}

function defaultConfig()
{
  var conf = '
web:
  build: .
  proxy:
    - ${repoName}.${branchName}.cogclient.com:80
  ports:
    - "80"
';

  return conf;
}

function buildImage(containerName, buildPath)
{
  var cmd = 'docker build -t '+containerName+' '+buildPath;
  execSync(cmd);
}

function tagImage(containerName)
{
  var cmd = 'docker tag '+containerName+' 52.89.116.88:32768/happycog/'+containerName;
  execSync(cmd);
}

function pushImage(container)
{
  var cmd = 'docker push 52.89.116.88:32768/happycog/'+containerName;
  execSync(cmd);
}

function checkForStack(serviceName)
{
  var cmd = 'aws ecs describe-services --region us-west-2 --service '+serviceName;
  var response = JSON.parse(execSync(cmd).toString());
  return response.services.length > 0 && response.services[0].status == 'ACTIVE';
}

function createStack(name, container)
{
  if (container.build) {
    delete container.build;
    container.image = '52.89.116.88:32768/happycog/'+containerName';
  }

  if (container.proxy) {
    delete container.proxy;
  }

  var cliInputJson = JSON.stringify({
    "serviceName": name,
    "taskDefinition": name,
    "desiredCount": count
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs create-service --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  return JSON.parse(execSync(cmd).toString());
}

function updateService(name, count)
{
  var cliInputJson = JSON.stringify({
    "service": name,
    "taskDefinition": name,
    "desiredCount": count
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs update-service --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  execSync(cmd);
}

function waitForService(name)
{
  var cliInputJson = JSON.stringify({
    "services": [name]
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs wait services-stable --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  execSync(cmd);
}

function getServiceTaskArns(name)
{
  var cliInputJson = JSON.stringify({
    "serviceName": name
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs list-tasks --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  var response = JSON.parse(execSync(cmd).toString());
  return response.taskArns;
}

function getTaskContainerBindings(taskArns)
{
  var cliInputJson = JSON.stringify({
    "tasks": taskArns
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs describe-tasks --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  var response = JSON.parse(execSync(cmd).toString());

  var bindings = [];
  response.tasks.forEach(function(task) {
    task.containers[0].networkBindings.forEach(function(binding) {
      binding.containerInstanceArn = task.containerInstanceArn;
      bindings.push(binding);
    });
  });

  return bindings;
}

function getContainerInstanceIps(containerInstanceArns)
{
  var cliInputJson = JSON.stringify({
    "containerInstances": containerInstanceArns
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs describe-container-instances --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  var response = JSON.parse(execSync(cmd).toString());
  var instanceIds = response.containerInstances.map(function(instance) {
    return instance.ec2InstanceId;
  });

  cliInputJson = JSON.stringify({
    "InstanceIds": instanceIds
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  cmd = 'aws ec2 describe-instances --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  var ec2InstanceResponse = JSON.parse(execSync(cmd).toString());

  return containerInstanceArns.map(function(arn, index) {
    return {
      "arn": arn,
      "ip": ec2InstanceResponse.Reservations[0].Instances[0].PublicIpAddress
    };
  });
}

function updateProxy(body)
{
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Content-Type: application/json" -X POST -d \''+body+'\' http://52.89.116.88:26542';
  return JSON.parse(execSync(cmd).toString());
}
