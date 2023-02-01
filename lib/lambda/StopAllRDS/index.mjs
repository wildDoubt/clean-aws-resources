import {
    RDSClient,
    DescribeDBInstancesCommand,
    StopDBInstanceCommand,
  } from "@aws-sdk/client-rds";
  
  const client = new RDSClient({
    region: process.env.REGION
  });
  
  const executeCommand = async (command) => {
    try {
        const data = await client.send(command);
  
        return data;
    } catch (error) {
        console.log(error);
  
        return error;
    }
  };
  
  const getDBInstances = async () => {
    const describeInstancesCommand = new DescribeDBInstancesCommand({});
    const result = await executeCommand(describeInstancesCommand);
  
    console.log(result);
  
    if (result.DBInstances.length === 0) return [];
  
    return result.DBInstances.map(instance => instance.DBInstanceIdentifier);
  }
  
  const stopInstance = async (instanceIdentifier) => {
    const stopInstancesCommand = new StopDBInstanceCommand({
        DBInstanceIdentifier: instanceIdentifier
    });
  
    const result = await executeCommand(stopInstancesCommand);
  
    return result;
  }
  
  export const handler = async (event) => {
    const runningInstanceIdList = await getDBInstances();
  
    if (runningInstanceIdList.length === 0) {
        return {
            "result": "실행 중인 RDS 인스턴스가 없습니다."
        };
    }
    
    await Promise.all(
          runningInstanceIdList.map(async instanceId => await stopInstance(instanceId)));
  
    return {
          statusCode: 200,
          body: JSON.stringify("모든 RDS 중지")
      };
  };