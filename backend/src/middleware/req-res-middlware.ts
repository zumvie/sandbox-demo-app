import Koa from "koa";
import * as v from "@badrap/valita";
import { writeEntities } from "../db-service";
import { AppContext } from "../app-context";

export const RequestEntity = v.object({
  identifier: v.string(),
  demoId: v.string(),
  headers: v.record(),
  originalUrl: v.string(),
  method: v.string(),
  body: v.unknown(),
});

export type RequestEntity = v.Infer<typeof RequestEntity>;

export const ResponseEntity = v.object({
  identifier: v.string(),
  demoId: v.string(),
  headers: v.record(),
  statusCode: v.number(),
  body: v.unknown(),
});

export type ResponseEntity = v.Infer<typeof ResponseEntity>;

export const createReqResMiddlware = (appContext: AppContext) => {
  return async (
    context: Koa.ParameterizedContext<{ identifiers: string[] }>,
    next: Koa.Next
  ) => {
    context.state = {
      ...(context.state || {}),
      identifiers: [],
    };

    await next();

    const identifiers = context.state.identifiers;

    if (!identifiers.length) {
      return;
    }

    const requestEntities: RequestEntity[] = identifiers.map((identifier) => {
      const match = identifier.match(/^\/Demo\/([^\/]+)/);

      let demoId = !match ? "unknown-demo-id" : match[1];

      return {
        identifier: identifier + "/Request",
        demoId: demoId,
        body: context.request.body,
        headers: context.request.headers,
        method: context.request.method,
        originalUrl: context.request.originalUrl,
      };
    });

    const responseEntities: ResponseEntity[] = identifiers.map((identifier) => {
      const match = identifier.match(/^\/Demo\/([^\/]+)/);

      let demoId = !match ? "unknown-demo-id" : match[1];

      return {
        identifier: identifier + "/Response",
        demoId: demoId,
        body: context.body,
        headers: context.headers,
        statusCode: context.status,
      };
    });

    await writeEntities(appContext, [...requestEntities, ...responseEntities]);
  };
};
