import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new cdk.aws_dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "account",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "identifier",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    const backend = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'Backend', {
      entry: "../backend/src/index.ts",    
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      bundling: {
        // localstack issue - https://github.com/localstack/localstack/issues/5131#issuecomment-995265153
        externalModules: [],
      }
    });

    const api = new cdk.aws_apigateway.LambdaRestApi(this, 'Api', {
      handler: backend,
      proxy: true,
    });

    const domainName = `${api.restApiId}.execute-api.${this.region}.amazonaws.com`;

    const cloudfront = new cdk.aws_cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.HttpOrigin(domainName),
      }
    });
  }
}
