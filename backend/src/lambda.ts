import app from "./app";
import serverlessExpress from "@vendia/serverless-express";

module.exports.handler = serverlessExpress({
  app: app.callback(),
});
