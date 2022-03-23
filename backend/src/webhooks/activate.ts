import Koa from "koa";

import { AccountEntity, createAccountEntity } from "../entities/account-entity";
import { writeEntities } from "../db-service";
import { AppContext } from "../app-context";
import { ActivateRequest, ActivateResponse } from "./entities";

export const activateWebhookRoute =
  (appContext: AppContext) =>
  async (context: Koa.ParameterizedContext<{ identifiers: string[] }>) => {
    const request = ActivateRequest.parse(context.request.body);
    const dateNow = Date.now();

    const accounts: AccountEntity[] = [];

    for (let i = 0; i < request.count; i++) {
      const entity = createAccountEntity(request.metadata, dateNow);
      accounts.push(entity);
      context.state.identifiers.push(entity.identifier);
    }

    await writeEntities(appContext, accounts);

    const responseBody = ActivateResponse.parse({
      accounts: accounts.map((acc): ActivateResponse["accounts"][0] => {
        return {
          deactivateData: {
            username: acc.username,
          },
          localStorage: {
            ACCESS_TOKEN_EXAMPLE: acc.accessToken,
          },
          sessionCookies: {
            SESSION_COOKIE_EXAMPLE: acc.sessionCookie,
          },
          generatedData: {
            accountEntity: acc,
          },
          sessionData: {
            username: acc.username,
            password: acc.password,
          },
        };
      }),
    });

    context.status = 200;
    context.body = responseBody;
  };
