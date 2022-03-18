import Koa from 'koa';
import { AppContext } from '../app-context';
import { queryDemoEntities } from '../db-service';


export const listDemoEntities = (appContext: AppContext) => async (context: Koa.Context) => {
  const { demoId } = context.params;

  const items = await queryDemoEntities(appContext, demoId);

  context.body = {
    items: items,
  }
}