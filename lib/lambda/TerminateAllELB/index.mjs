import {
    ElasticLoadBalancingV2Client,
    DescribeLoadBalancersCommand,
    DeleteLoadBalancerCommand
} from "@aws-sdk/client-elastic-load-balancing-v2";

const client = new ElasticLoadBalancingV2Client({
    region: process.env.REGION
});

const executeCommand = async (command) => {
    try {
        const data = await client.send(command);

        return data;
        // process data.
    } catch (error) {
        // error handling.
        console.log(error);

        return error;
    }
};

const getLoadBalancers = async () => {
    const describeCommand = new DescribeLoadBalancersCommand({});
    const result = await executeCommand(describeCommand);

    return result.LoadBalancers;
}

const deleteLoadBalancer = async (arn) => {
    const deleteCommand = new DeleteLoadBalancerCommand({
        "LoadBalancerArn": arn
    });
    const result = await executeCommand(deleteCommand);

    return result;
}

export const handler = async (event) => {
    const loadBalancerList = await getLoadBalancers();

    await Promise.all(
        loadBalancerList.map(async loadBalancer => await deleteLoadBalancer(loadBalancer.LoadBalancerArn)));

    return {
        statusCode: 200,
        body: JSON.stringify("모든 로드밸런서 종료")
    };
};