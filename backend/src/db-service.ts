import { AppContext } from "./app-context";
import { AccountEntity } from "./entities/account-entity";
import { WebhookEntity } from "./entities/webhook-entity";

export type DynamoEntity = {
  demoId: string;
  identifier: string;
};

export const writeEntities = async <T extends DynamoEntity>(
  context: AppContext,
  entities: T[]
) => {
  await context.documentClient
    .batchWrite({
      RequestItems: {
        [context.tableName]: entities.map((account) => {
          return {
            PutRequest: {
              Item: account,
            },
          };
        }),
      },
    })
    .promise();
};

export const queryDemoEntities = async (
  context: AppContext,
  demoId: string
): Promise<unknown[]> => {
  const response = await context.documentClient
    .query({
      TableName: context.tableName,
      KeyConditionExpression: `demoId = :demoId and begins_with(identifier, :identifier)`,
      ExpressionAttributeValues: {
        ":demoId": demoId,
        ":identifier": `/Demo/${demoId}/`,
      },
      ScanIndexForward: false,
    })
    .promise();

  return response.Items || [];
};

export const queryAccountEntities = async (
  context: AppContext,
  input: {
    demoId: string;
    accountId: string;
  }
): Promise<unknown[]> => {
  const response = await context.documentClient
    .query({
      TableName: context.tableName,
      KeyConditionExpression: `demoId = :demoId and begins_with(identifier, :identifier)`,
      ExpressionAttributeValues: {
        ":demoId": input.demoId,
        ":identifier": `/Demo/${input.demoId}/Account/${input.accountId}`,
      },
      ScanIndexForward: false,
    })
    .promise();

  return response.Items || [];
};

export const getAccountByUsername = async (
  context: AppContext,
  username: string
): Promise<AccountEntity> => {
  const response = await context.documentClient
    .query({
      TableName: context.tableName,
      IndexName: "UsernameIndex",
      KeyConditionExpression: "username = :username",
      Limit: 1,
      ExpressionAttributeValues: {
        ":username": username,
      },
    })
    .promise();

  return AccountEntity.parse(response.Items?.[0]);
};
