import * as v from "@badrap/valita";
import {DeactivateRequest, SessionRequest } from "../webhooks/entities";

export const SessionEntity = v.object({
  demoId: v.string(),
  identifier: v.string(),
  date: v.number(),
  requestPayload: SessionRequest,
})


export const createSessionEntity = (sessionRequest: SessionRequest, date: number) => {
  const demoId = sessionRequest.sessionData.username;
  const accountId = sessionRequest.sessionData.password;
  
  return SessionEntity.parse({
    demoId: demoId,
    identifier: `/Demo/${demoId}/Date/Session/${accountId}`,
    date: date,

    requestPayload: sessionRequest,
  });
}