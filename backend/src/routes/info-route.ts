import Koa from "koa";

export const infoRoute = () => (context: Koa.Context) => {
  context.body = {
    originUrl: context.originalUrl,
  };
};
