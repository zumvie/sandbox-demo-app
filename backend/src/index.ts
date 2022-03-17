import Koa from 'koa';
import Router from "koa-router";
import koaBodyParser from "koa-bodyparser";
import AWS from "aws-sdk"

import { activateWebhookRoute } from './webhooks/activate';
import { deactivateWebhookRoute } from './webhooks/deactivate';
import { sessionWebhookRoute } from './webhooks/session';
import serverlessExpress from '@vendia/serverless-express';
import { infoRoute } from './routes/info-route';

const app = new Koa();
const router = new Router();
const documentClient = new AWS.DynamoDB.DocumentClient();

// webhooks for zumvie integration
router.post("/webhooks/zumvie/activate", activateWebhookRoute(documentClient));
router.post("/webhooks/zumvie/deactivate", deactivateWebhookRoute(documentClient));
router.post("/webhook/zumvie/session", sessionWebhookRoute(documentClient));

router.get("/(.*)", infoRoute());

app.use(koaBodyParser());
app.use(router.routes());

console.log("hellooo!!");

module.exports.handler = serverlessExpress({ 
  app: app.callback() 
});