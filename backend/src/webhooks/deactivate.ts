import Koa from 'koa';
import { AppContext } from '../app-context';
import { writeEntities } from '../db-service';
import { createDeactivateAccountEntity } from '../entities/deactivate-entity';
import { DeactivateRequest } from './entities';

export const deactivateWebhookRoute = (appContext: AppContext) => async (context: Koa.Context) => {
  const request = DeactivateRequest.parse(context.request.body);
  const dateNow = Date.now();

  const deactivateEntity = createDeactivateAccountEntity(request, dateNow)

  await writeEntities(appContext, [deactivateEntity]);

  context.status = 204; 
}