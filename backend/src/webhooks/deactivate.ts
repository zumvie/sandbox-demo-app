import Koa from 'koa';
import { AppContext } from '../app-context';
import { getAccountByUsername, writeEntities } from '../db-service';
import { createDeactivateAccountEntity } from '../entities/deactivate-entity';
import { DeactivateRequest } from './entities';

export const deactivateWebhookRoute = (appContext: AppContext) => async (context: Koa.Context) => {
  console.log("context.request.body", context.request.body)
  const request = DeactivateRequest.parse(context.request.body);
  const dateNow = Date.now();

  const account = await getAccountByUsername(appContext, request.deactivateData.username);
 
  const deactivateEntity = createDeactivateAccountEntity(request, account, dateNow)

  await writeEntities(appContext, [deactivateEntity]);

  context.status = 204; 
}