import * as v from "@badrap/valita";
import { AccountMetadata } from "../entities/account-entity";

export const ActivateRequest = v.object({
  type: v.literal("Activate"),
  count: v.number().assert((v) => v > 0 && v <= 10, "Count is not in the range of [1; 10]"),
  metadata: AccountMetadata,
});

export const LocalStorage = v.object({
  ACCESS_TOKEN_EXAMPLE: v.string(),
});

export const SessionCookies = v.object({
  SESSION_COOKIE_EXAMPLE: v.string(),
});

export const GeneratedData = v.record(v.unknown()).optional();

export const SessionData = v.object({
  username: v.string(),
  password: v.string(),
})

const DeactivateData = v.object({
  demoId: v.string(),
  accountId: v.string(),
});

export const ActivateResponse = v.object({
  accounts: v.array(
    v.object({
      localStorage: LocalStorage,
      sessionCookies: SessionCookies,
      deactivateData: DeactivateData,
      generatedData: v.record(v.unknown()),
      sessionData: SessionData,
    })
  ),
});

export type ActivateRequest = v.Infer<typeof ActivateRequest>;
export type ActivateResponse = v.Infer<typeof ActivateResponse>;