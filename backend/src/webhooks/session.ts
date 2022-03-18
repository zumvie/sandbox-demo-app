import Koa from 'koa';
import { AppContext } from '../app-context';
import { getAccountByUsername, writeEntities } from '../db-service';
import { createSessionEntity } from '../entities/session-entity';
import { SessionRequest, SessionResponse } from './entities';

export const sessionWebhookRoute = (appContext: AppContext) => async (context: Koa.Context) => {
  const request = SessionRequest.parse(context.request.body);
  const dateNow = Date.now();

  const account = await getAccountByUsername(appContext, request.sessionData.username);

  const sessionEntity = createSessionEntity(request, account, dateNow);

  await writeEntities(appContext, [sessionEntity]);

  context.status = 200;

  context.body = SessionResponse.parse({
    localStorage: {
      SESSION_REQUEST_ACCESS_TOKEN_EXAMPLE: "SESSION_REQUEST_ACCESS_TOKEN_EXAMPLE",
    },
    cookies: {
      SESSION_REQUEST_COOKIE_EXAMPLE: "SESSION_REQUEST_COOKIE_EXAMPLE",
    },
  });

  context.cookies.set("SESSION_REQUEST_RESPONSE_COOKIE", "SESSION_REQUEST_RESPONSE_COOKIE");
}