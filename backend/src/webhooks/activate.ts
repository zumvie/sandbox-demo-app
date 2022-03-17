import Koa from 'koa';
import * as v from "@badrap/valita";

const ActivateRequest = v.object({
  count: v.number(),
  metadata: v.unknown(),
});


export const activateWebhookRoute = (docClient: AWS.DynamoDB.DocumentClient) => (context: Koa.Context) => {
  const body = ActivateRequest.parse(context.request.body);
  context.body = body;
}
