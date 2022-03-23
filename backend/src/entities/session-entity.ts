import * as v from "@badrap/valita";
import { SessionRequest } from "../webhooks/entities";
import { AccountEntity } from "./account-entity";

export const SessionEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  accountId: v.string(),
  date: v.number(),
  type: v.literal("Session"),
  requestPayload: SessionRequest,
});

export const createSessionEntity = (
  sessionRequest: SessionRequest,
  accountEntity: AccountEntity,
  date: number
) => {
  const demoId = accountEntity.demoId;
  const accountId = accountEntity.accountId;

  return SessionEntity.parse({
    demoId: demoId,
    identifier: `/Demo/${demoId}/Date/${date}/Session/${accountId}`,
    accountId: accountId,
    type: "Session",
    date: date,
    requestPayload: sessionRequest,
  });
};
