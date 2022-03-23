import * as AWS from "aws-sdk";
import "dotenv/config";

const getEnvString = (name: string): string => {
  if (typeof process.env[name] !== "string") {
    throw new Error(`Env variable ${name} is not string`);
  }

  return process.env[name] as string;
};

export const appContext = {
  tableName: getEnvString("TABLE_NAME"),
  documentClient: new AWS.DynamoDB.DocumentClient({
    region: getEnvString("AWS_REGION"),
  }),
};

export type AppContext = typeof appContext;
