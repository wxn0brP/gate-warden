import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { abacCheck, aclCheck, rbacCheck } from "./check";
import { COLORS, logAccess } from "./log";
import { CheckParams } from "./types/check";
import { AccessResult, User } from "./types/system";

export async function fetchUser(db: ValtheraCompatible, userId: Id): Promise<User> {
    const user = await db.findOne<User>("users", { _id: userId });
    if (!user) throw new Error("User not found");
    return user;
}

export async function matchPermission(
    db: ValtheraCompatible,
    entityId: Id,
    flag: number,
    user: User,
    debugLog: number
): Promise<AccessResult> {
    const checks = [
        { name: "ACL", method: aclCheck },
        { name: "RBAC", method: rbacCheck },
        { name: "ABAC", method: abacCheck },
    ] as const;

    const results = [];

    const checkParams: CheckParams = { db, entityId, flag, user, debugLog };
    for (const check of checks) {
        const result = await check.method(checkParams);
        results.push(result);
        if (result === true || result === 1) {
            return { granted: true, via: check.name };
        }
    }

    if (results[0] === -1) {
        return { granted: false, via: "entity-404" };
    }

    return { granted: false, via: null };
}

export class GateWarden {
    constructor(public db: ValtheraCompatible, public debugLog: number = 0) { }

    async hasAccess(userId: string, entityId: string, flag: number): Promise<AccessResult> {
        const user = await fetchUser(this.db, userId);
        if (!user) {
            if (this.debugLog >= 1) console.log(COLORS.red + "[GW] User not found." + COLORS.reset);
            return {
                granted: false,
                via: "user-404"
            };
        }

        const matched = await matchPermission(this.db, entityId, flag, user, this.debugLog);

        if (matched.granted) {
            logAccess(userId, entityId, matched.via, this.debugLog);
            return matched;
        }

        if (!matched.granted && matched.via === "entity-404") {
            if (this.debugLog >= 1) console.log(COLORS.red + `[GW] Entity not found: ${entityId}` + COLORS.reset);
            return matched;
        }

        if (this.debugLog >= 1) console.log(COLORS.red + `[GW] Access denied to ${entityId} by ${userId}.` + COLORS.reset);
        return {
            granted: false,
            via: "not-permitted"
        };
    }
}