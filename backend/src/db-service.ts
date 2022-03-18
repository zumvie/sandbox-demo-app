

import { AppContext } from "./app-context";

export type DynamoEntity = {
  demoId: string;
  identifier: string;
}

export const batchWrite = async <T extends DynamoEntity>(context: AppContext, entitiy: T[]) => {
  await context.documentClient.batchWrite({
    RequestItems: {
      [context.tableName]: entitiy.map(account => {
        return {
          PutRequest: {
            Item: account,
          },
        }
      })
    }
  }).promise();
}