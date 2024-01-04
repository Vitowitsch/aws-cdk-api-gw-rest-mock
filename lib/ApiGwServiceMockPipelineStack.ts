
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Role, ServicePrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import {
  CodePipelineSource,
  CodePipeline,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { AppStage } from "./AppStage";

interface MyStackProps extends cdk.StackProps {
  env: {
    account: string ;
    region: string | undefined;
  };
}

export class ApiGwServiceMockPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);
    const repository = codecommit.Repository.fromRepositoryName(
      this,
      "ImportedRepo",
      "ApiGwServiceMock",
    );

    const pipelineRole = `ApiGwServiceMockPipelineRole}`;
    new Role(this, pipelineRole, {
      assumedBy: new ServicePrincipal("codepipeline.amazonaws.com"),
    });

    const pipelineName = `ApiGwServiceMockPipeline`;
    const pipeline = new CodePipeline(this, pipelineName, {
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.codeCommit(repository, "main"),
        commands: [
          "npm ci",
          "npm run check-format",
          "npm run lint",
          "npm run test",
          '[ "$BRANCH" = "master" ] && npm run test:coverage || true',
          "npm run build",
          "npx cdk synth",
          "pip install checkov",
          "checkov --directory cdk.out -o sarif || true",
        ],
      }),
      crossAccountKeys: true,
      synthCodeBuildDefaults: {
        rolePolicy: [
          new PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: ["*"],
            conditions: {
              StringEquals: {
                "iam:ResourceTag/aws-cdk:bootstrap-role": "lookup",
              },
            },
          }),
        ],
      },
    });

    pipeline.addStage(
      new AppStage(this, "dev", {
        env: {
          account: process.env.CDK_DEFAULT_ACCOUNT,
          region: process.env.CDK_DEFAULT_REGION,
        },
      }),
    );

    pipeline.buildPipeline();

    const cfnOutName = `ApiGwServiceMockPipelineName`;
    new cdk.CfnOutput(this, cfnOutName, {
      value: pipeline.pipeline.pipelineName,
      exportName: cfnOutName,
      description: cfnOutName,
    });
  }
}
