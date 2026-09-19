import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACManager } from "./mgr/abac.js";
import { ACLManager } from "./mgr/acl.js";
import { RBACManager } from "./mgr/rbac.js";
import { RoleManager } from "./mgr/role.js";
import { ABACRule, Role } from "./types/system.js";
export declare class WardenManager {
    readonly role: RoleManager;
    readonly acl: ACLManager;
    readonly rbac: RBACManager;
    readonly abac: ABACManager;
    constructor(db: ValtheraCompatible);
    /** @deprecated */
    changeRoleNameToId(name: string): Promise<string>;
    /** @deprecated */
    roleExists(roleId: Id): Promise<boolean>;
    /** @deprecated */
    addRole(role: Role | Omit<Role, "_id">): Promise<Role & {
        _id: string;
    }>;
    /** @deprecated */
    removeRole(roleId: string): Promise<Role>;
    /** @deprecated */
    addACLRule(entityId: string, p: number, uid?: Id): Promise<import("./types/system.js").ACLRule>;
    /** @deprecated */
    removeACLRule(entityId: string, uid?: string): Promise<import("./types/system.js").ACLRule>;
    /** @deprecated */
    addRBACRule(roleId: string, entityId: string, p: number): Promise<import("./types/system.js").RoleRule>;
    /** @deprecated */
    removeRBACRule(roleId: string, entityId: string): Promise<import("./types/system.js").RoleRule>;
    /** @deprecated */
    addABACRule(entityId: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule & {
        _id: string;
    }>;
    /** @deprecated */
    removeABACRule(entityId: string, flag: number): Promise<ABACRule>;
}
