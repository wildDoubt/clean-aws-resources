import {
    EC2Client,
    DescribeInstancesCommand,
    StopInstancesCommand,
} from "@aws-sdk/client-ec2";

const NO_RUNNING_INSTANCES = "실행 중인 EC2 인스턴스가 없습니다.";

const client = new EC2Client({
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

const createFilter = (filterName, filterValues) => {
    return {
        "Name": filterName,
        "Values": filterValues
    }
}

const getRunningInstances = async () => {
    const runningStateFilter = createFilter("instance-state-name", ["running"])

    const describeInstancesCommand = new DescribeInstancesCommand({
        Filters: [ runningStateFilter ]
    });
    const result = await executeCommand(describeInstancesCommand);

    if (result.Reservations.length === 0) return [];

    // 결과로 나온 instance id를 리스트로 반환
    return result.Reservations.map(reservation => reservation.Instances)
        .reduce((acc, curr) => [...acc, ...curr])
        .map(ec2Instance => ec2Instance.InstanceId);
}

const stopInstance = async (instanceIds) => {
    const stopInstancesCommand = new StopInstancesCommand({
        InstanceIds: instanceIds
    });
    const result = await executeCommand(stopInstancesCommand);

    return result;
}

export const handler = async (event) => {
    const runningInstanceIdList = await getRunningInstances();

    if (runningInstanceIdList.length === 0) {
        return {
            "result": NO_RUNNING_INSTANCES
        };
    }

    const response = await stopInstance(runningInstanceIdList);

    return response;
};