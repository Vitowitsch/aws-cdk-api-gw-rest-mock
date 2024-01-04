import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGwServiceMockStack } from "./ApiGwServiceMockStack";

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new ApiGwServiceMockStack(this, "ApiGwServiceMockStack", {
      stackName: "ApiGwServiceMockStack",
    });
  }
}
