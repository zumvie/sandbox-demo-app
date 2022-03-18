import { AppContext } from "./app-context";

export type DynamoEntity = {
  demoId: string;
  identifier: string;
}

export const writeEntities = async <T extends DynamoEntity>(context: AppContext, entities: T[]) => {
  await context.documentClient.batchWrite({
    RequestItems: {
      [context.tableName]: entities.map(account => {
        return {
          PutRequest: {
            Item: account,
          },
        }
      })
    }
  }).promise();
}