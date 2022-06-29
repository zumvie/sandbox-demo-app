# About

Example app which visualizes webhook calls for zumvie sandbox integration. Hosted version can be accessed [https://sandbox-demo.app.zumvie.com](https://sandbox-demo.app.zumvie.com).

# Production

For production acm certificateArn in us-east-1 is required and domain name associated with it.

Before login to ecr: `get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws`

Command: `npm run deploy -- --context domainName=<domainName>`
