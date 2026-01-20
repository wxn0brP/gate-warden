
import hasFieldsAdvanced from "@wxn0brp/db-core/utils/hasFieldsAdvanced";
import { COLORS } from "./log";
import { CheckParams } from "./types/check";
import { ABACRule, ACLRule, RoleEntity } from "./types/system";
import { convertPath } from "./utils";
import { collections } from "./const";

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
export async function aclCheck({ db, entityId, flag, user }: CheckParams): Promise<number> {
    if (!await db.issetCollection(collections.acl + "/" + entityId)) return -1;

    const rules = await db.find<ACLRule>(collections.acl + "/" + entityId, {
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
export async function rbacCheck({ db, flag, user, entityId }: CheckParams): Promise<boolean> {
    for (const role of user.roles) {
        const rolesEntity = await db.find<RoleEntity>(collections.role + "/" + role, { _id: entityId });
        for (const entity of rolesEntity) {
            if (entity.p & flag) return true;
        }
    }
    return false;
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
export async function abacCheck({ db, entityId, flag, user, debugLog }: CheckParams): Promise<boolean> {
    if (!await db.issetCollection(collections.abac + "/" + entityId)) return false;

    const rules = await db.find<ABACRule>(collections.abac + "/" + entityId, { flag });
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