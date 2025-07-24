import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule, ACLRule, Role, RoleEntity } from "./types/system.js";
declare class WardenManager {
    private db;
    constructor(db: ValtheraCompatible);
    changeRoleNameToId(name: string): Promise<Id>;
    addRole(role: Role): Promise<Role>;
    addACLRule(entityId: string, p: number, uid?: Id): Promise<ACLRule>;
    addRBACRule(role_id: string, entity_id: string, p: number): Promise<RoleEntity>;
    addABACRule(entity_id: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule>;
    removeRole(roleId: string): Promise<boolean>;
    removeACLRule(entityId: string, uid?: string): Promise<boolean>;
    removeRBACRule(roleId: string, entityId: string): Promise<boolean>;
    removeABACRule(entityId: string, flag: number): Promise<boolean>;
}
export default WardenManager;
