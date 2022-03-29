import Koa from "koa";
import { AppContext } from "../app-context";
import { queryAccountEntities } from "../db-service";
import setCookie from "set-cookie-parser";

export const whoamiRoute =
  (appContext: AppContext) => async (context: Koa.Context) => {
    const cookies = setCookie(context.request.header["cookie"] || "", {
      decodeValues: true,
      silent: true,
    }).reduce<{ [key: string]: string }>((acc, cookie) => {
      return {
        ...acc,
        [cookie.name]: cookie.value,
      };
    }, {});

    context.body = {
      status: "User not found",
      accountId: "",
      demoId: "",
      entities: [],
      cookies: {
        ...cookies,
      },
      headers: {
        ...context.request.headers,
      },
    };

    // this is initialized in activate account webhook
    const cookie = context.cookies.get("SESSION_COOKIE_ACCOUNT_TOKEN");

    if (!cookie) {
      return;
    }

    const { accountId, demoId } = JSON.parse(
      Buffer.from(cookie, "base64").toString("utf-8")
    );

    const entities = await queryAccountEntities(appContext, {
      accountId,
      demoId,
    });

    console.log(cookies);

    context.body = {
      status: "User found",
      accountId: accountId,
      demoId: demoId,
      cookies: {
        ...cookies,
      },
      headers: {
        ...context.request.headers,
      },
      entities: entities,
    };
  };
