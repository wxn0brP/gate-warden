import { abacCheck, aclCheck, rbacCheck } from "./check.js";
import { COLORS, logAccess } from "./log.js";
import { collections } from "./const.js";
export async function fetchUser(db, userId) {
    const user = await db.findOne(collections.users, { _id: userId });
    if (!user)
        throw new Error("User not found");
    return user;
}
export async function matchPermission(db, entityId, flag, user, debugLog) {
    const checks = [
        { name: "ACL", method: aclCheck },
        { name: "RBAC", method: rbacCheck },
        { name: "ABAC", method: abacCheck },
    ];
    const results = [];
    const checkParams = { db, entityId, flag, user, debugLog };
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
    db;
    debugLog;
    constructor(db, debugLog = 0) {
        this.db = db;
        this.debugLog = debugLog;
    }
    async hasAccess(userId, entityId, flag) {
        const user = await fetchUser(this.db, userId);
        if (!user) {
            if (this.debugLog >= 1)
                console.log(COLORS.red + "[GW] User not found." + COLORS.reset);
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
            if (this.debugLog >= 1)
                console.log(COLORS.red + `[GW] Entity not found: ${entityId}` + COLORS.reset);
            return matched;
        }
        if (this.debugLog >= 1)
            console.log(COLORS.red + `[GW] Access denied to ${entityId} by ${userId}.` + COLORS.reset);
        return {
            granted: false,
            via: "not-permitted"
        };
    }
}
