import Koa from 'koa';


import { AccountEntity, createAccountEntity } from '../entities/account-entity';
import { writeEntities } from '../db-service';
import { AppContext } from '../app-context';
import { ActivateRequest, ActivateResponse } from './entities';

export const activateWebhookRoute = (appContext: AppContext) => async (context: Koa.Context) => {
  const request = ActivateRequest.parse(context.request.body);
  const dateNow = Date.now();

  const accounts: AccountEntity[] = [];

  for (let i = 0; i < request.count; i++) {
    accounts.push(createAccountEntity(request.metadata, dateNow));
  }

  await writeEntities(appContext, accounts);

  const responseBody = ActivateResponse.parse({
    accounts: accounts.map((acc): ActivateResponse["accounts"][0] => {
      return {
        deactivateData: {
          demoId: acc.demoId,
          accountId: acc.accountId,
        },
        localStorage: {
          "ACCESS_TOKEN_EXAMPLE": acc.accessToken,
        },
        sessionCookies: {
          "SESSION_COOKIE_EXAMPLE": acc.sessionCookie,
        },
        generatedData: {
          accountEntity: acc
        },
        sessionData: {
          username: acc.username,
          password: acc.password,
        },
      }
    }),
  });

  context.status = 200;
  context.body = responseBody;
}
