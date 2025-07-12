import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule, AccessResult, ACLRule, RoleEntity, User } from "./types/system";
import { COLORS } from "./log";
import hasFieldsAdvanced from "@wxn0brp/db-core/utils/hasFieldsAdvanced";

interface CheckParams {
    db: ValtheraCompatible;
    entityId: Id;
    flag: number;
    user: User;
    debugLog: number;
}

function logAccess(userId: Id, entityId: Id, via: string, debugLog: number) {
    if (debugLog < 1) return;
    console.log(
        `${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
        `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`
    );
}

async function fetchUser(db: ValtheraCompatible, userId: Id): Promise<User> {
    const user = await db.findOne<User>("users", { _id: userId });
    if (!user) throw new Error("User not found");
    return user;
}

/**
 * Checks if a user has the given flag on the given entity by checking the entity's ACL.
 * @param db The DB instance
 * @param flag The flag to check
 * @param user The user to check
 * @param entityId The ID of the entity to check
 * @returns If the user has the flag on the entity:
 *   - 1 if the user has the flag
 *   - 0 if the user does not have the flag
 *   - -1 if the entity does not have an ACL
 */
async function aclCheck({ db, entityId, flag, user }: CheckParams): Promise<number> {
    if (!await db.issetCollection("acl/" + entityId)) return -1;
    const rules = await db.find<ACLRule>("acl/" + entityId, {
        $or: [
            { uid: user._id },
            {
                $not: {
                    $exists: { "uid": true }
                }
            }
        ]
    });
    if (rules.length === 0) return -1;
    for (const rule of rules) {
        if (rule.p & flag) return 1;
    }
    return 0;
}

/**
 * Checks if a user has the given flag on the given entity by checking each role the user has.
 * @param db The DB instance
 * @param flag The flag to check
 * @param user The user to check
 * @param entityId The ID of the entity to check
 * @returns If the user has the flag on the entity
 */
async function rbacCheck({ db, flag, user, entityId }: CheckParams): Promise<boolean> {
    for (const role of user.roles) {
        const rolesEntity = await db.find<RoleEntity>("role/" + role, { _id: entityId });
        for (const entity of rolesEntity) {
            if (entity.p & flag) return true;
        }
    }
    return false;
}

function convertPath(user: any, path: string): any {
    const keys = path.split(".");
    let data = user;
    for (const key of keys) {
        data = data?.[key];
        if (data === undefined) return undefined;
    }
    return data;
}

/**
 * ABAC (Attribute-Based Access Control) check
 * @param db The DB instance
 * @param entityId The ID of the entity to check
 * @param flag The flag to check
 * @param user The user to check
 * @param debugLog The debug log level
 * @returns `true` if access is granted, `false` otherwise
 */
async function abacCheck({ db, entityId, flag, user, debugLog }: CheckParams): Promise<boolean> {
    if (!await db.issetCollection("abac/" + entityId)) return false;

    const rules = await db.find<ABACRule>("abac/" + entityId, { flag });
    if (rules.length === 0) return false;

    for (const rule of rules) {
        let authorized = true;

        if (debugLog >= 1)
            console.log(
                COLORS.blue + `[GW] ABAC rule: ${COLORS.yellow}${JSON.stringify(rule.condition)}${COLORS.blue} ` +
                `-> checking...` + COLORS.reset
            );

        for (const key in rule.condition) {
            const expectedValue = rule.condition[key];

            let actualValue: any;
            if (key === "_") actualValue = user;
            else actualValue = convertPath(user, key);

            if (actualValue === undefined) {
                authorized = false;
                break;
            }

            if (!hasFieldsAdvanced(actualValue, expectedValue)) {
                authorized = false;
                break;
            }
        }

        if (authorized) {
            if (debugLog >= 1)
                console.log(COLORS.green + `[GW] Access granted by this rule.` + COLORS.reset);
            return true;
        }
    }

    return false;
}

async function matchPermission(
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

class GateWarden<A = any> {
    constructor(private db: ValtheraCompatible, public debugLog: number = 0) { }

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

export default GateWarden;