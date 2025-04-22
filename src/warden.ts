import { Id, Valthera } from "@wxn0brp/db";
import { ABACRule, AccessResult, ACLRule, RoleEntity, User } from "./types/system";
import { COLORS } from "./log";
import { createDb } from "./createDb";

interface CheckParams<A> {
    db: Valthera;
    entityId: Id;
    flag: number;
    user: User<A>;
    debugLog: number;
}

function logAccess(userId: Id, entityId: Id, via: string, debugLog: number) {
    if (debugLog < 1) return;
    console.log(
        `${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
        `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`
    );
}

async function fetchUser<A>(db: Valthera, userId: Id): Promise<User<A>> {
    const user = await db.findOne<User<A>>("users", { _id: userId });
    if (!user) throw new Error("User not found");
    return user;
}

async function aclCheck<A>({ db, entityId, flag, user }: CheckParams<A>): Promise<number> {
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

async function rbacCheck<A>({ db, flag, user, entityId }: CheckParams<A>): Promise<boolean> {
    for (const role of user.roles) {
        const rolesEntity = await db.find<RoleEntity>("role/" + role, { _id: entityId });
        for (const entity of rolesEntity) {
            if (entity.p & flag) return true;
        }
    }
    return false;
}

async function abacCheck<A>({ db, entityId, flag, user, debugLog }: CheckParams<A>): Promise<boolean> {
    if (!await db.issetCollection("abac/" + entityId)) return false;
    const rules = await db.find<ABACRule<A>>("abac/" + entityId, { flag });
    for (const rule of rules) {
        try {
            const conditions = new Function("user", "entity", `return ${rule.conditions}`)();
            if (debugLog >= 1)
                console.log(
                    COLORS.blue + `[GW] ABAC rule: ${COLORS.yellow}${rule.conditions}${COLORS.blue} ` +
                    `-> ${COLORS.yellow}${conditions(user, entityId)}` + COLORS.reset
                );

            if (conditions(user, entityId)) return true;
        } catch (e) {
            if (debugLog >= 1) console.log(COLORS.red + `[GW] ABAC rule error: ${e}` + COLORS.reset);
        }
    }
    return false;
}

async function matchPermission<A>(
    db: Valthera,
    entityId: Id,
    flag: number,
    user: User<A>,
    debugLog: number
): Promise<AccessResult> {
    const checks = [
        { name: "ACL", method: aclCheck },
        { name: "RBAC", method: rbacCheck },
        { name: "ABAC", method: abacCheck },
    ] as const;

    const results = [];

    const checkParams: CheckParams<A> = { db, entityId, flag, user, debugLog };
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
    private db: Valthera;

    constructor(valthera: string | Valthera, public debugLog: number = 0) {
        this.db = createDb(valthera);
    }

    async hasAccess(userId: string, entityId: string, flag: number): Promise<AccessResult> {
        const user = await fetchUser<A>(this.db, userId);
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