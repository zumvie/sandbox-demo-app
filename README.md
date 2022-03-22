# Getting Started

1. Install deps - `npm install -g esbuild` (Issue with [#19442](https://github.com/aws/aws-cdk/issues/19442))
1. Start docker containers - `docker-compose up`
2. Bootstrap localstack environemt - `cdklocal bootstrap`
3. Login into AWS Public registry - `aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws` (Issue with [#17268](https://github.com/aws/aws-cdk/issues/17268))
3. Deploy infrastracture to localstack - `DOCKER_DEFAULT_PLATFORM=linux/amd64 cdklocal deploy`  
