import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaStack } from '../lib/lambda-stack';

const LAMBDA_FUNCTION = 'AWS::Lambda::Function';
const EVENT_RULE = 'AWS::Events::Rule';
test('Lambda created', () => {
   // given
   const app = new cdk.App();
   const stack = new LambdaStack(app, 'LambdaStack');

   // when
   const template = Template.fromStack(stack);

   // then
   template.resourceCountIs(LAMBDA_FUNCTION, 3);
   // rule이 1개 생성
   // 람다 함수가 rule의 target이 되었는지
});

test('Event rule created', () => {
   // given
   const app = new cdk.App();
   const stack = new LambdaStack(app, 'LambdaStack');

   // when
   const template = Template.fromStack(stack);

   // then
   template.resourceCountIs(EVENT_RULE, 1);
});

test('Lambda functions targeted to event rule', () => {
   // given
   const app = new cdk.App();
   const stack = new LambdaStack(app, 'LambdaStack');

   // when
   const template = Template.fromStack(stack);

   // then
   template.resourcePropertiesCountIs(LAMBDA_FUNCTION, {}, 3);
});