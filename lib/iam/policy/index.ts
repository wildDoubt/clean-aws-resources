import * as iam from 'aws-cdk-lib/aws-iam';

interface PolicyInterface {
    [key: string]: iam.PolicyStatement;
}

const stopEC2InstancesPolicy: iam.PolicyStatement = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
        'ec2:StopInstances',
        'ec2:DescribeInstances'
    ],
    resources: ['arn:aws:ec2:::*']
})



const stopRDSInstancesPolicy: iam.PolicyStatement = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
        'rds:StopDBInstance',
        'rds:DescribeDBInstances'
    ],
    resources: ['arn:aws:rds:::*']
})

const terminateELBPolicy: iam.PolicyStatement = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
        'elasticloadbalancing:DeleteLoadBalancer',
        'elasticloadbalancing:DescribeLoadBalancers'
    ],
    resources: ['arn:aws:elasticloadbalancing:::*']
})


export const policies: PolicyInterface = {
    "stopAllEC2": stopEC2InstancesPolicy,
    "stopAllRDS": stopRDSInstancesPolicy,
    "terminateAllELB": terminateELBPolicy
}
