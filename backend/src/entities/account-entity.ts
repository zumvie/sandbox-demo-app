import * as v from "@badrap/valita";
import { v4 } from "uuid";

export const AccountMetadata = v.object({
  demoId: v.string(),
});

export type AccountMetadata = v.Infer<typeof AccountMetadata>;

export const AccountEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  date: v.number(),
  expireDate: v.number(),
  type: v.literal("Activate"),
  accountId: v.string(),
  username: v.string(),
  password: v.string(),
  sessionCookie: v.string(),
  localStorage: v.string(),
  metadata: AccountMetadata,
});

export type AccountEntity = v.Infer<typeof AccountEntity>;

export const createAccountEntity = (
  metadata: AccountEntity["metadata"],
  date: number
) => {
  const uniqueId = v4();
  const accountId = `ACCOUNT-${uniqueId}`;
  const expireDate = Math.round(date / 1000) + 60 * 60 * 24 * 7;

  const identifier = `/Demo/${metadata.demoId}/Account/${accountId}/Activate/Date/${date}/`;

  const accountKeys = Buffer.from(
    JSON.stringify({
      accountId: accountId,
      demoId: metadata.demoId,
    }),
    "utf-8"
  ).toString("base64");

  return AccountEntity.parse({
    demoId: metadata.demoId,
    identifier: identifier,
    type: "Activate",
    expireDate: expireDate,
    date: date,
    accountId: accountId,
    username: `USERNAME-${uniqueId}`,
    password: `PASSWORD-${uniqueId}`,
    sessionCookie: accountKeys,
    localStorage: accountKeys,
    metadata: metadata,
  });
};
