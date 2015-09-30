var fs = require('fs');
var execSync = require('child_process').execSync;

fs.readFile('Dockerrun.aws.json', 'utf8', function (err, data) {
  if (err) {
    console.log("Data file not found, using defaults.");
    var repoName = process.argv[2];
    var branchName = process.argv[3];
    if (!repoName || !branchName) {
      throw new Error('Repo ('+repoName+') or branch ('+branchName+') not valid.');
    }
    data = defaultConfig(repoName, branchName);
  }

  var json;
  try {
    json = JSON.parse(data);
  }
  catch (e) {
    throw new Error('Unable to parse json data: '+data);
  }

  json.forEach(function(container) {
    registerTask(container);

    console.log('Checking for exising service...');
    if (checkForService(container.name)) {
      console.log('Service found, updating existing service...');
      updateService(container.name, container.desiredCount);
      console.log('Update complete.');
    }
    else {
      console.log('Service not found, creating new service...');
      createService(container.name, container.desiredCount);
      console.log('Creation complete.');
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

    console.log('Creating mapping...');
    console.log(bindings, ips);
  });
});

function defaultConfig(repoName, branchName)
{
  var conf = [
    {
      "name": repoName+"-"+branchName+"-web",
      "build": ".",
      "desiredCount": 1,
      "hosts": [
        repoName+"-"+branchName+".cogclient.com"
      ],
      "containerDefinition": {
        "name":"web",
        "image":"52.89.116.88:32768/happycog/"+repoName+"-"+branchName+"-web",
        "cpu":1,
        "memory":4,
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

  if (branchName == 'master') {
    conf[0].hosts.push(repoName+".cogclient.com");
  }

  return JSON.stringify(conf);
}

function registerTask(json)
{
  var cliInputJson = JSON.stringify({
    "family": json.name,
    "containerDefinitions": [json.containerDefinition]
  }).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'aws ecs register-task-definition --region us-west-2 --cli-input-json "'+cliInputJson+'"';
  execSync(cmd);
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
