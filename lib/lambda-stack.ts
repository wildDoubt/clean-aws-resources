import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as fs from 'fs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from "path";

const LAMBDA_PATH = 'lib/lambda';
const FILE_NAME = 'index';
const WORK_OFF_CRON = 'cron(0 9 * * ? *)';
const RULE_NAME = 'RegularRule';

const getAllLambdaFunctions = () => {
    const currentDirectory = process.cwd() + '/' + LAMBDA_PATH;

    const files = fs.readdirSync(currentDirectory);
    const directories = files.filter(file => fs.statSync(path.join(currentDirectory, file)).isDirectory());

    return directories;
}

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const directories: string[] = getAllLambdaFunctions();
        
        const rule = new events.Rule(this, RULE_NAME, {
            schedule: events.Schedule.expression(WORK_OFF_CRON)
        });

        directories.forEach(async directoryName => {
            const lambdaFunction = await new lambda.Function(this, directoryName, {
                functionName: directoryName,
                code: lambda.Code.fromAsset(LAMBDA_PATH + '/' + directoryName),
                handler: FILE_NAME + '.handler',
                runtime: lambda.Runtime.NODEJS_16_X
            });
            rule.addTarget(new targets.LambdaFunction(lambdaFunction));
        });
    }
}
