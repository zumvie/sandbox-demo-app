import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class Backend extends Construct {
  public readonly restApiEndpoint: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new cdk.aws_dynamodb.Table(this, "Table", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "demoId",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "identifier",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: "expireDate",
    });

    new cdk.CfnOutput(this, "TableName", {
      value: table.tableName,
      exportName: "tableName",
    });

    table.addGlobalSecondaryIndex({
      indexName: "UsernameIndex",
      partitionKey: {
        name: "username",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    const backend = new cdk.aws_lambda_nodejs.NodejsFunction(this, "Backend", {
      entry: "../backend/src/lambda.ts",
      projectRoot: "../backend",
      depsLockFilePath: "../backend/package-lock.json",
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const api = new apigateway.HttpApi(this, "HttpApi", {
      apiName: "ZumvieDemoAppApi",
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowOrigins: ["*"],
        exposeHeaders: ["*"],
      },
    });

    const integration = new integrations.HttpLambdaIntegration(
      "HttpIntegration",
      backend,
      {
        payloadFormatVersion: apigateway.PayloadFormatVersion.VERSION_2_0,
      }
    );

    api.addRoutes({
      path: "/{proxy+}",
      methods: [apigateway.HttpMethod.ANY],
      integration: integration,
    });

    this.restApiEndpoint = `${api.apiId}.execute-api.${api.env.region}.amazonaws.com`;

    table.grantReadWriteData(backend);
  }
}
