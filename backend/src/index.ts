import Koa from 'koa';
import Router from "koa-router";
import koaBodyParser from "koa-bodyparser";

import { activateWebhookRoute } from './webhooks/activate';
import { deactivateWebhookRoute } from './webhooks/deactivate';
import { sessionWebhookRoute } from './webhooks/session';
import serverlessExpress from '@vendia/serverless-express';
import { infoRoute } from './routes/info-route';
import { appContext } from './app-context';

const app = new Koa();
const router = new Router();

// webhooks for zumvie integration
router.post("/webhooks/zumvie/activate", activateWebhookRoute(appContext));
router.post("/webhooks/zumvie/deactivate", deactivateWebhookRoute(appContext));
router.post("/webhooks/zumvie/session", sessionWebhookRoute(appContext));

router.get("/(.*)", infoRoute());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {

    ctx.status = err.statusCode || err.status || 500;

    ctx.body = {
      message: err.message
    };
  }

});
app.use(koaBodyParser());
app.use(router.routes());

module.exports.handler = serverlessExpress({ 
  app: app.callback() 
});