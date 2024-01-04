import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export function getExport(name: string): string {
  return cdk.Fn.importValue(name);
}

export function getBaseVpc(context: cdk.Stack): ec2.IVpc {
  return ec2.Vpc.fromLookup(context, 'BaseVPC4RestApiMock', {
    vpcId: 'vpcId',
  });
}

