import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule, ACLRule, Role, RoleRule } from "./types/system.js";
export declare class WardenManager {
    private db;
    constructor(db: ValtheraCompatible);
    changeRoleNameToId(name: string): Promise<Id>;
    addRole(role: Role | Omit<Role, "_id">): Promise<Role>;
    addACLRule(entityId: string, p: number, uid?: Id): Promise<ACLRule>;
    addRBACRule(role_id: string, entity_id: string, p: number): Promise<RoleRule>;
    addABACRule(entity_id: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule>;
    removeRole(roleId: string): Promise<Role | null>;
    removeACLRule(entityId: string, uid?: string): Promise<ACLRule | null>;
    removeRBACRule(roleId: string, entityId: string): Promise<RoleRule | null>;
    removeABACRule(entityId: string, flag: number): Promise<ABACRule | null>;
}
