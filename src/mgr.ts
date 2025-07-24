import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule, ACLRule, Role, RoleEntity } from "./types/system";

class WardenManager {
    constructor(private db: ValtheraCompatible) { }

    async changeRoleNameToId(name: string): Promise<Id> {
        return await this.db.findOne<Role>("roles", { name }).then((r) => r._id);
    }

    // ADD
    async addRole(role: Role): Promise<Role> {
        return await this.db.add<Role>("roles", role);
    }

    async addACLRule(entityId: string, p: number, uid?: Id): Promise<ACLRule> {
        const rule: ACLRule = { p };
        if (uid) rule.uid = uid;
        return await this.db.add<ACLRule>("acl/" + entityId, rule, false);
    }

    async addRBACRule(role_id: string, entity_id: string, p: number): Promise<RoleEntity> {
        return await this.db.add<RoleEntity>("role/" + role_id, { _id: entity_id, p }, false);
    }

    async addABACRule(entity_id: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule> {
        return await this.db.add<ABACRule>("abac/" + entity_id, { flag, condition }, true);
    }

    // DELETE
    async removeRole(roleId: string): Promise<boolean> {
        return await this.db.removeOne("roles", { roleId });
    }

    async removeACLRule(entityId: string, uid?: string): Promise<boolean> {
        const q = uid ? { uid } : { $not: { $exists: { "uid": true } } };
        return await this.db.removeOne("acl/" + entityId, q);
    }

    async removeRBACRule(roleId: string, entityId: string): Promise<boolean> {
        return await this.db.removeOne("role/" + roleId, { _id: entityId });
    }

    async removeABACRule(entityId: string, flag: number): Promise<boolean> {
        return await this.db.removeOne("abac/" + entityId, { flag });
    }
}

export default WardenManager;