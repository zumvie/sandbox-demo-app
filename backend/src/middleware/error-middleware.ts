import Koa from "koa";
import * as v from "@badrap/valita";

export const RequestEntity = v.object({
  identifier: v.string(),
  headers: v.record(),
  originalUrl: v.string(),
  method: v.string(),
  body: v.unknown(),
});

export type RequestEntity = v.Infer<typeof RequestEntity>;

export const ResponseEntity = v.object({
  identifier: v.string(),
  headers: v.record(),
  statusCode: v.number(),
  body: v.unknown(),
});

export type ResponseEntity = v.Infer<typeof ResponseEntity>;

export const createErrorMiddleware = () => {
  return async (
    context: Koa.ParameterizedContext<{ identifiers?: string[] }>,
    next: Koa.Next
  ) => {
    try {
      await next();
    } catch (err: any) {
      console.error(err);
      context.status = err.statusCode || err.status || 500;

      context.body = {
        message: err.message,
      };
    }
  };
};
