# About

Example app which visualizes webhook calls for zumvie sandbox integration. Hosted version can be accessed [https://sandbox-demo-app.zumvie.com](https://sandbox-demo.app.zumvie.com).

# Getting Started

1. Bootstrap cdk environemt - `npm run bootstrap`
2. Login into AWS Public registry - `aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws` (Issue with [#17268](https://github.com/aws/aws-cdk/issues/17268))
3. Deploy example app - `npm run deploy`


# Production

For production acm certificateArn in us-east-1 is required and domain name associated with it.

Command: `npm run deploy -- --context domainName=<domainName> --context certificateId=<certificateId>`
