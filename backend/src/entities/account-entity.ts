import * as v from "@badrap/valita";
import {v4} from "uuid";

export const AccountMetadata = v.object({
  demoId: v.string(),
});

export type AccountMetadata = v.Infer<typeof AccountMetadata>;

export const AccountEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),

  accountId: v.string(),
  username: v.string(),
  password: v.string(),
  sessionCookie: v.string(),
  accessToken: v.string(),

  metadata: AccountMetadata,
})

export type AccountEntity = v.Infer<typeof AccountEntity>;

export const createAccountEntity = (metadata: AccountEntity["metadata"]) => {
  const uniqueId = v4();
  const accountId = `AC${uniqueId}`;

  return AccountEntity.parse({
    demoId: metadata.demoId,
    identifier: `/Demo/${metadata.demoId}/Account/${accountId}`,

    accountId: accountId,
    username: `USERNAME-${uniqueId}`,
    password: `PASSWORD-${uniqueId}`,
    sessionCookie: `SESSION-COOKIE-${uniqueId}`,
    accessToken: `ACCESS-TOKEN-${uniqueId}`,
    metadata: metadata,
  });
}