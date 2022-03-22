import Koa from 'koa';
import Router from "koa-router";
// @ts-ignore
import cors from "@koa/cors";
import koaBodyParser from "koa-bodyparser";

import { activateWebhookRoute } from './webhooks/activate';
import { deactivateWebhookRoute } from './webhooks/deactivate';
import { sessionWebhookRoute } from './webhooks/session';
import { infoRoute } from './routes/info-route';
import { appContext } from './app-context';
import { listDemoEntities } from './routes/backend-api';


const app = new Koa();
const router = new Router();

// for local development
app.use(cors());

// webhooks for zumvie integration
router.post("/api/v1/webhooks/zumvie/activate", activateWebhookRoute(appContext));
router.post("/api/v1/webhooks/zumvie/deactivate", deactivateWebhookRoute(appContext));
router.post("/api/v1/webhooks/zumvie/session", sessionWebhookRoute(appContext));

// api for demo website
router.get("/api/v1/demo/:demoId", listDemoEntities(appContext));

// something to return in generic case
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

export default app;