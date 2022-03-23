import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Backend } from "./backend";
import { Frontend } from "./frontend";

export type DistributionProps = {
  backend: Backend;
  frontend: Frontend;
  domainName?: string;
  certificateId?: string;
};

export class Distribution extends Construct {
  public readonly bucket: cdk.aws_s3.Bucket;

  private readonly distribution: cdk.aws_cloudfront.Distribution;
  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    const accessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "AccessIdentity"
    );

    // certificate required from us-east-1 therefore importing it instead of creating
    const certificate = props.certificateId
      ? cdk.aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          "Certificate",
          cdk.Arn.format({
            service: "acm",
            region: "us-east-1",
            account: cdk.Stack.of(this).account,
            resource: "certificate",
            resourceName: props.certificateId,
            partition: "aws",
          })
        )
      : undefined;

    const domainNames = props.domainName ? [props.domainName] : undefined;

    this.distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "Distribution",
      {
        certificate: certificate,
        domainNames: domainNames,
        defaultRootObject: "/index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(
            props.frontend.bucket,
            {
              originAccessIdentity: accessIdentity,
            }
          ),
          cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy:
            cdk.aws_cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
          allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
          originRequestPolicy:
            cdk.aws_cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        },
      }
    );

    this.distribution.addBehavior(
      "/api/v1/*",
      new cdk.aws_cloudfront_origins.HttpOrigin(props.backend.restApiEndpoint),
      {
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy:
          cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy:
          cdk.aws_cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy:
          cdk.aws_cloudfront.OriginRequestPolicy.CORS_CUSTOM_ORIGIN,
      }
    );

    props.frontend.bucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        principals: [accessIdentity.grantPrincipal],
        actions: ["s3:GetObject"],
        resources: [`${props.frontend.bucket.bucketArn}/*`],
      })
    );

    new cdk.CfnOutput(this, "CloudfrontEndpoint", {
      value: `https://${this.distribution.distributionDomainName}/`,
      exportName: "cloudfrontEndpoint",
    });
  }

  public invalidateCache() {
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
            DistributionId: this.distribution.distributionId,
            InvalidationBatch: {
              CallerReference: String(Date.now()),
              Paths: {
                Quantity: "1",
                Items: ["/*"],
              },
            },
          },
          physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
            `${this.distribution.domainName}Invalidation`
          ),
        },
        onCreate: {
          action: "createInvalidation",
          service: "CloudFront",
          parameters: {
            DistributionId: this.distribution.distributionId,
            InvalidationBatch: {
              CallerReference: String(Date.now()),
              Paths: {
                Quantity: "1",
                Items: ["/*"],
              },
            },
          },
          physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
            `${this.distribution.domainName}Invalidation`
          ),
        },
      }
    );

    invalidateRequest.node.addDependency(this.distribution);
  }
}
