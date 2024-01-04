import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { getBaseVpc} from './VpcCfg';

export class ApiGwServiceMockStack extends cdk.Stack {
  bucketArn: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
      const openApiSpec = fs.readFileSync('./openapi.yaml', 'utf-8');
  
      new apigateway.SpecRestApi(this, 'MyMockedApi', {
        apiDefinition: apigateway.ApiDefinition.fromInline(openApiSpec)
      });
   

    
    const myApi = new apigateway.RestApi(this, 'MyAwesomeAPI', {
      restApiName: `my-awesome-api`, // <--- this is the name of the gateway api in Console
      description: `RestAPI for my awesome app`,
      endpointConfiguration: {
        types: [apigateway.EndpointType.PRIVATE],
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*/*/*'],
            conditions: {
              StringEquals: {
                'aws:SourceVpce': process.env.VPC_ID,
              }
            }
          })
        ]
      })
  });
  const myVpc = getBaseVpc(this);
   new ec2.InterfaceVpcEndpoint(this, 'ApiVpcEndpoint', {
    vpc: myVpc,
    service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
    privateDnsEnabled: true,
  });


    new cdk.CfnOutput(this, `${getStackModifier(this)}ApiGwServiceMockLambdaArn`, {
      value: myApi.url,
      exportName: `${getStackModifier(this)}ApiGwServiceMockLambdaArn`,
      description: `${getStackModifier(this)}ApiGwServiceMockLambdaArn`,
    });
  }
}

