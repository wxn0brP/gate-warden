import { ValtheraCompatible } from "@wxn0brp/db-core";
import { Id } from "@wxn0brp/db-core/types/Id";
import { User } from "./system.js";
export interface CheckParams {
    db: ValtheraCompatible;
    entityId: Id;
    flag: number;
    user: User;
    debugLog?: number;
}
