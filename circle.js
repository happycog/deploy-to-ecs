var fs = require('fs');
var execSync = require('child_process').execSync;

var repoName = process.argv[2];
var branchName = process.argv[3];
if (!repoName || !branchName) {
  throw new Error('Repo ('+repoName+') or branch ('+branchName+') not valid.');
}

var data;

try {
  data = fs.readFileSync('Dockerrun.aws.json', 'utf8');
  console.log("Using Dockerrun.aws.json");
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
  json = JSON.parse(data);
}
catch (e) {
  throw new Error('Unable to parse json data: '+data);
}

json.forEach(function(container) {
  if (container.build) {
    console.log('Building '+container.name+'...');
    buildImage(container);

    console.log('Tagging '+container.name+'...');
    tagImage(container);

    console.log('Pushing '+container.name+'...');
    pushImage(container);
  }

  console.log('Updating task definition...');
  var taskDefinition = registerTask(container);
  console.log('  > Task definition updated to ', taskDefinition.taskDefinition.revision);

  console.log('Checking for exising service...');
  if (checkForService(container.name)) {
    console.log('Service found, updating existing service...');
    updateService(container.name, container.desiredCount);
    console.log('  > Update complete.');
  }
  else {
    console.log('Service not found, creating new service...');
    createService(container.name, container.desiredCount);
    console.log('  > Creation complete.');
  }

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
  (container.hosts || []).forEach(function(host) {
    proxies[host] = 'http://'+ips[0].ip+':'+bindings[0].hostPort;
  });
  console.log('  > Updated, ', updateProxy(proxies));
});

function defaultConfig()
{
  var conf = [
    {
      "name": '${repoName}-${branchName}-web',
      "build": ".",
      "desiredCount": 1,
      "hosts": [
        "upstream.com.cogclient.${branchName}.${repoName}:80"
      ],
      "containerDefinition": {
        "name":"web",
        "image":'52.89.116.88:32768/happycog/${repoName}-${branchName}-web',
        "cpu":1,
        "memory":32,
        "essential":true,
        "portMappings":[
          {
            "containerPort":80,
            "hostPort":0,
            "protocol":"tcp"
          }
        ]
      }
    }
  ];

  return JSON.stringify(conf);
}

function buildImage(container)
{
  var cmd = 'docker build -t '+container.name+' '+container.build;
  execSync(cmd);
}

function tagImage(container)
{
  var cmd = 'docker tag '+container.name+' 52.89.116.88:32768/happycog/'+container.name;
  execSync(cmd);
}

function pushImage(container)
{
  var cmd = 'docker push 52.89.116.88:32768/happycog/'+container.name;
  execSync(cmd);
}

function registerTask(json)
{
  var cliInputJson = JSON.stringify({
    "family": json.name,
    "containerDefinitions": [json.containerDefinition]
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs register-task-definition --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  return JSON.parse(execSync(cmd).toString());
}

function checkForService(serviceName)
{
  var cmd = 'aws ecs describe-services --region us-west-2 --service '+serviceName;
  var response = JSON.parse(execSync(cmd).toString());
  return response.services.length > 0 && response.services[0].status == 'ACTIVE';
}

function createService(name, count)
{
  var cliInputJson = JSON.stringify({
    "serviceName": name,
    "taskDefinition": name,
    "desiredCount": count
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs create-service --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  console.log(execSync(cmd));
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
