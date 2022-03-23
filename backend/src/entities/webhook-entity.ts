import * as v from "@badrap/valita";
import { AccountEntity } from "./account-entity";
import { DeactivateEntity } from "./deactivate-entity";
import { SessionEntity } from "./session-entity";

export const WebhookEntity = v.union(
  AccountEntity,
  SessionEntity,
  DeactivateEntity
);

export type WebhookEntity = v.Infer<typeof WebhookEntity>;
