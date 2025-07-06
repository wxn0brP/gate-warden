import { Id, Valthera } from "@wxn0brp/db";
import { ABACRule, Role } from "./types/system.js";
import { Remote } from "@wxn0brp/db/client/remote.js";
declare class WardenManager {
    private db;
    constructor(valthera: string | Valthera | Remote);
    changeRoleNameToId(name: string): Promise<Id>;
    addRole(role: Role): Promise<Role>;
    addACLRule(entityId: string, p: number, uid?: Id): Promise<void>;
    addRBACRule(role_id: string, entity_id: string, p: number): Promise<void>;
    addABACRule(entity_id: string, flag: number, condition: ABACRule["condition"]): Promise<void>;
    removeRole(roleId: string): Promise<boolean>;
    removeACLRule(entityId: string, uid?: string): Promise<boolean>;
    removeRBACRule(roleId: string, entityId: string): Promise<boolean>;
    removeABACRule(entityId: string, flag: number): Promise<boolean>;
}
export default WardenManager;
