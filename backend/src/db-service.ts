import { AppContext } from "./app-context";
import { AccountEntity } from "./entities/account-entity";
import { DemoEntity } from "./entities/demo-entity";

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

export const queryDemoEntities = async (context: AppContext, demoId: string): Promise<DemoEntity[]> => {
  const response = await context.documentClient.query({
    TableName: context.tableName,
    KeyConditionExpression: `demoId = :demoId and begins_with(identifier, :identifier)`,
    ExpressionAttributeValues: {
      ":demoId": demoId,
      ":identifier": `/Demo/${demoId}/`,
    },
    ScanIndexForward: false,
  }).promise();

  return response.Items!.map(item => DemoEntity.parse(item));
} 

export const getAccountByUsername = async (context: AppContext, username: string): Promise<AccountEntity> => {
  const response = await context.documentClient.query({
    TableName: context.tableName,
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :username",
    Limit: 1,
    ExpressionAttributeValues: {
      ":username": username,
    }
  }).promise();

  return AccountEntity.parse(response.Items?.[0]);
}