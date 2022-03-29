import Koa from "koa";
import { AppContext } from "../app-context";
import { queryDemoEntities } from "../db-service";
import { WebhookEntity } from "../entities/webhook-entity";
import { RequestEntity, ResponseEntity } from "../middleware/req-res-middlware";

export const listDemoEntities =
  (appContext: AppContext) => async (context: Koa.Context) => {
    const { demoId }: { demoId: string } = context.params;

    const items = await queryDemoEntities(appContext, demoId);

    const requestItems = items.filter(
      (item): item is RequestEntity => RequestEntity.try(item).ok
    );
    const responseItems = items.filter(
      (item): item is ResponseEntity => ResponseEntity.try(item).ok
    );
    const webhookItems = items.filter(
      (item): item is WebhookEntity => WebhookEntity.try(item).ok
    );

    requestItems.forEach((reqItem) => {
      const demoItem = webhookItems.find((demoItem) => {
        return reqItem.identifier.startsWith(demoItem.identifier);
      });

      (demoItem as any).request = reqItem;
    });

    responseItems.forEach((resItem) => {
      const demoItem = webhookItems.find((demoItem) => {
        return resItem.identifier.startsWith(demoItem.identifier);
      });

      (demoItem as any).response = resItem;
    });

    context.body = {
      items: webhookItems,
    };
  };
