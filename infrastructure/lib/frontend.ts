import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class Frontend extends Construct {
  public readonly bucket: cdk.aws_s3.Bucket;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.bucket = new cdk.aws_s3.Bucket(this, "FrontendAssets", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // dockerized way of building assets for frontend
    const websiteAssets = cdk.aws_lambda.Code.fromDockerBuild("../", {
      file: "frontend/Dockerfile.frontend",
      imagePath: "/frontend/build/",
      platform: "linux/amd64",
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "AssetsDeployment", {
      destinationBucket: this.bucket,
      sources: [cdk.aws_s3_deployment.Source.asset(websiteAssets.path)],
    });
  }
}
