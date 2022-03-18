import * as v from "@badrap/valita";
import {DeactivateRequest } from "../webhooks/entities";

export const DeactivateEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  date: v.number(),
  requestPayload: DeactivateRequest,
})


export const createDeactivateAccountEntity = (deactivateRequest: DeactivateRequest, date: number) => {
  const demoId = deactivateRequest.deactivateData.demoId;
  const accountId = deactivateRequest.deactivateData.accountId;
  
  return DeactivateEntity.parse({
    demoId: demoId,
    identifier: `/Demo/${demoId}/Date/Deactivate/${accountId}`,
    date: date,

    requestPayload: deactivateRequest,
  });
}