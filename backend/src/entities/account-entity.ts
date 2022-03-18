import * as v from "@badrap/valita";
import {v4} from "uuid";

export const AccountMetadata = v.object({
  demoId: v.string(),
});

export type AccountMetadata = v.Infer<typeof AccountMetadata>;

export const AccountEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  date: v.number(),
  type: v.literal("Activate"),

  accountId: v.string(),
  username: v.string(),
  password: v.string(),
  sessionCookie: v.string(),
  accessToken: v.string(),

  metadata: AccountMetadata,
})

export type AccountEntity = v.Infer<typeof AccountEntity>;

export const createAccountEntity = (metadata: AccountEntity["metadata"], date: number) => {
  const uniqueId = v4();
  const accountId = `ACCOUNT-${uniqueId}`;

  return AccountEntity.parse({
    demoId: metadata.demoId,
    identifier: `/Demo/${metadata.demoId}/Date/Account/${accountId}`,
    type: "Activate",
    date: date,
    accountId: accountId,
    username: `USERNAME-${uniqueId}`,
    password: `PASSWORD-${uniqueId}`,
    sessionCookie: `SESSION-COOKIE-${uniqueId}`,
    accessToken: `ACCESS-TOKEN-${uniqueId}`,
    metadata: metadata,
  });
}