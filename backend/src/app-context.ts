import * as AWS from "aws-sdk";

const getEnvString = (name: string): string => {
  if (typeof process.env[name] !== "string") {
    throw new Error(`Env variable ${name} is not string`);
  }

  return process.env[name] as string;
}

const localStackEndpoint = `http://${getEnvString("LOCALSTACK_HOSTNAME")}:4566`;
console.log("Localstack endpoint", localStackEndpoint);

export const appContext = {
  tableName: getEnvString("TABLE_NAME"),
  documentClient: new AWS.DynamoDB.DocumentClient({
    endpoint: localStackEndpoint,
  }),
}

console.log("AppContext", appContext);

export type AppContext = typeof appContext;