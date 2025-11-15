import { CheckParams } from "./types/check.js";
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
export declare function aclCheck({ db, entityId, flag, user }: CheckParams): Promise<number>;
/**
 * Checks if a user has the given flag on the given entity by checking each role the user has.
 * @param db The DB instance
 * @param flag The flag to check
 * @param user The user to check
 * @param entityId The ID of the entity to check
 * @returns If the user has the flag on the entity
 */
export declare function rbacCheck({ db, flag, user, entityId }: CheckParams): Promise<boolean>;
/**
 * ABAC (Attribute-Based Access Control) check
 * @param db The DB instance
 * @param entityId The ID of the entity to check
 * @param flag The flag to check
 * @param user The user to check
 * @param debugLog The debug log level
 * @returns `true` if access is granted, `false` otherwise
 */
export declare function abacCheck({ db, entityId, flag, user, debugLog }: CheckParams): Promise<boolean>;
