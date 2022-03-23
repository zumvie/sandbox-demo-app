import Koa from "koa";
import { AppContext } from "../app-context";
import { getAccountByUsername, writeEntities } from "../db-service";
import { createDeactivateAccountEntity } from "../entities/deactivate-entity";
import { DeactivateRequest } from "./entities";

export const deactivateWebhookRoute =
  (appContext: AppContext) =>
  async (context: Koa.ParameterizedContext<{ identifiers: string[] }>) => {
    const deactivateBody = DeactivateRequest.parse(context.request.body);
    const dateNow = Date.now();

    const account = await getAccountByUsername(
      appContext,
      deactivateBody.deactivateData.username
    );

    const deactivateEntity = createDeactivateAccountEntity(
      deactivateBody,
      account,
      dateNow
    );

    context.state.identifiers.push(deactivateEntity.identifier);

    await writeEntities(appContext, [deactivateEntity]);

    context.status = 204;
  };
