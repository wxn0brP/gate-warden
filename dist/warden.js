import { COLORS } from "./log.js";
import { createDb } from "./createDb.js";
function logAccess(userId, entityId, via, debugLog) {
    if (debugLog < 1)
        return;
    console.log(`${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
        `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`);
}
async function fetchUser(db, userId) {
    const user = await db.findOne("users", { _id: userId });
    if (!user)
        throw new Error("User not found");
    return user;
}
async function aclCheck({ db, entityId, flag, user }) {
    if (!await db.issetCollection("acl/" + entityId))
        return -1;
    const rules = await db.find("acl/" + entityId, {
        $or: [
            { uid: user._id },
            {
                $not: {
                    $exists: { "uid": true }
                }
            }
        ]
    });
    if (rules.length === 0)
        return -1;
    for (const rule of rules) {
        if (rule.p & flag)
            return 1;
    }
    return 0;
}
async function rbacCheck({ db, flag, user, entityId }) {
    for (const role of user.roles) {
        const rolesEntity = await db.find("role/" + role, { _id: entityId });
        for (const entity of rolesEntity) {
            if (entity.p & flag)
                return true;
        }
    }
    return false;
}
async function abacCheck({ db, entityId, flag, user, debugLog }) {
    if (!await db.issetCollection("abac/" + entityId))
        return false;
    const rules = await db.find("abac/" + entityId, { flag });
    for (const rule of rules) {
        try {
            const conditions = new Function("user", "entity", `return ${rule.conditions}`)();
            if (debugLog >= 1)
                console.log(COLORS.blue + `[GW] ABAC rule: ${COLORS.yellow}${rule.conditions}${COLORS.blue} ` +
                    `-> ${COLORS.yellow}${conditions(user, entityId)}` + COLORS.reset);
            if (conditions(user, entityId))
                return true;
        }
        catch (e) {
            if (debugLog >= 1)
                console.log(COLORS.red + `[GW] ABAC rule error: ${e}` + COLORS.reset);
        }
    }
    return false;
}
async function matchPermission(db, entityId, flag, user, debugLog) {
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
class GateWarden {
    debugLog;
    db;
    constructor(valthera, debugLog = 0) {
        this.debugLog = debugLog;
        this.db = createDb(valthera);
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
export default GateWarden;
//# sourceMappingURL=warden.js.map