import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { AccessResult, User } from "./types/system.js";
export declare function fetchUser(db: ValtheraCompatible, userId: Id): Promise<User>;
export declare function matchPermission(db: ValtheraCompatible, entityId: Id, flag: number, user: User, debugLog: number): Promise<AccessResult>;
export declare class GateWarden {
    db: ValtheraCompatible;
    debugLog: number;
    constructor(db: ValtheraCompatible, debugLog?: number);
    hasAccess(userId: string, entityId: string, flag: number): Promise<AccessResult>;
}
