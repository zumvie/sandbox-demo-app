import Koa from "koa";

export const infoRoute = () => (context: Koa.Context) => {
  context.body = {
    method: context.method,
    originUrl: context.originalUrl,
  };
};
