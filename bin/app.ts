import * as cdk from "aws-cdk-lib";
import { ApiGwServiceMockPipelineStack } from "../lib/ApiGwServiceMockPipelineStack";
import { ApiGwServiceMockStack } from "../lib/ApiGwServiceMockStack";

const app = new cdk.App();
new ApiGwServiceMockStack(app, `ApiGwServiceMockStack`, {
  stackName: `ApiGwServiceMockStack`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new ApiGwServiceMockPipelineStack(
  app,
  `ApiGwServiceMockPipelineStack`,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  },
);

app.synth();
