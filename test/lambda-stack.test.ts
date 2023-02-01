import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaStack } from '../lib/lambda-stack';

test('Lambda created', () => {
   // given
   const app = new cdk.App();
   const stack = new LambdaStack(app, 'LambdaStack');

   // when
   const template = Template.fromStack(stack);

   // then
   template.resourceCountIs('AWS::Lambda::Function', 3);
});