import * as v from "@badrap/valita";
import { AccountEntity } from "./account-entity";
import { DeactivateEntity } from "./deactivate-entity";
import { SessionEntity } from "./session-entity";

export const DemoEntity = v.union(AccountEntity, SessionEntity, DeactivateEntity);

export type DemoEntity = v.Infer<typeof DemoEntity>;