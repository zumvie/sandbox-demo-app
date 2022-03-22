import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DemoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendLambdaHandler = this.createBackend();
    const frontendAssetsBucket = this.createFrontend();

    const api = new cdk.aws_apigateway.LambdaRestApi(this, 'Api', {
      handler: backendLambdaHandler,
      endpointExportName: "restApiEndpoint",
      proxy: true,
    });

    const domainName = `${api.restApiId}.execute-api.${this.region}.amazonaws.com`;

    const accessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "AccessIdentity"
    );

    const cloudfront = new cdk.aws_cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "/index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(frontendAssetsBucket, {
          originPath: "",
          originAccessIdentity: accessIdentity,
        }),
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cdk.aws_cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy: cdk.aws_cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
      }
    });

    cloudfront.addBehavior("/api/v1/*", new cdk.aws_cloudfront_origins.HttpOrigin(domainName));    

    frontendAssetsBucket.addToResourcePolicy( new cdk.aws_iam.PolicyStatement({
      principals: [accessIdentity.grantPrincipal],
      actions: ["s3:GetObject"],
      resources: [`${frontendAssetsBucket.bucketArn}/*`,],
    }));

    new cdk.CfnOutput(this, "CloudfrontEndpoint", {
      value: `https://${cloudfront.distributionDomainName}/`,
      exportName: "cloudfrontEndpoint"
    });

    this.invalidateCache(cloudfront);
  }

  private createBackend(): cdk.aws_lambda.Function {
    const table = new cdk.aws_dynamodb.Table(this, "Table", {
      tableName: "Test4",
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

    table.addGlobalSecondaryIndex({
      indexName: "UsernameIndex",
      partitionKey: {
        name: "username",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      }
    });
    
    const backend = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'Backend', {
      entry: "../backend/src/index.ts",    
      projectRoot: "../backend",
      depsLockFilePath: "../backend/package-lock.json",
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      bundling: {
        // localstack issue - https://github.com/localstack/localstack/issues/5131#issuecomment-995265153
        externalModules: [],
      },
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    table.grantReadWriteData(backend);

    return backend;
  }

  private createFrontend(): cdk.aws_s3.Bucket {

    const assetsBucket = new cdk.aws_s3.Bucket(this, "FrontendAssets");
    
    // dockerized way of building assets for frontend
    const websiteAssets = cdk.aws_lambda.Code.fromDockerBuild("../", {
      file: "frontend/Dockerfile.frontend",
      imagePath: "/frontend/build/",
      platform: "linux/amd64",
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "AssetsDeployment", {
      destinationBucket: assetsBucket,
      sources: [cdk.aws_s3_deployment.Source.asset(websiteAssets.path)],
    });

    return assetsBucket;
  }

  private invalidateCache(distribution: cdk.aws_cloudfront.Distribution) {
    const policy = cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
      resources: cdk.custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
    });

    const invalidateRequest = new cdk.custom_resources.AwsCustomResource(
      this,
      "InvalidateCache",
      {
        policy: policy,
        onUpdate: {
          action: "createInvalidation",
          service: "CloudFront",
          parameters: {
            DistributionId: distribution.distributionId,
            InvalidationBatch: {
              CallerReference: String(Date.now()),
              Paths: {
                Quantity: "1",
                Items: ["/*"],
              },
            },
          },
          physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
            `${distribution.domainName}Invalidation`
          ),
        },
        onCreate: {
          action: "createInvalidation",
          service: "CloudFront",
          parameters: {
            DistributionId: distribution.distributionId,
            InvalidationBatch: {
              CallerReference: String(Date.now()),
              Paths: {
                Quantity: "1",
                Items: ["/*"],
              },
            },
          },
          physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
            `${distribution.domainName}Invalidation`
          ),
        },
      }
    );

    invalidateRequest.node.addDependency(distribution);
  }
}
