import * as v from "@badrap/valita";
import { DeactivateRequest } from "../webhooks/entities";
import { AccountEntity } from "./account-entity";

export const DeactivateEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  accountId: v.string(),
  date: v.number(),
  type: v.literal("Deactivate"),
  requestPayload: DeactivateRequest,
});

export const createDeactivateAccountEntity = (
  deactivateRequest: DeactivateRequest,
  accountEntity: AccountEntity,
  date: number
) => {
  const demoId = accountEntity.demoId;
  const accountId = accountEntity.accountId;

  return DeactivateEntity.parse({
    demoId: demoId,
    identifier: `/Demo/${demoId}/Date/${date}/Deactivate/${accountId}`,
    date: date,
    type: "Deactivate",
    accountId: accountId,
    requestPayload: deactivateRequest,
  });
};
