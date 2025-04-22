import { Id, Valthera } from "@wxn0brp/db";
import { ABACRule, ACLRule, Role } from "./types/system";
import { Remote } from "@wxn0brp/db/dist/client/remote";
import { createDb } from "./createDb";

class WardenManager<A = any> {
    private db: Valthera;
    constructor(valthera: string | Valthera | Remote) {
        this.db = createDb(valthera);
    }

    async changeRoleNameToId(name: string): Promise<Id> {
        return await this.db.findOne("roles", { name });
    }

    // ADD
    async addRole(role: Role): Promise<Role> {
        return await this.db.add("roles", role);
    }

    async addACLRule(entityId: string, p: number, uid?: Id): Promise<void> {
        const rule: ACLRule = { p };
        if (uid) rule.uid = uid;
        return await this.db.add("acl/"+entityId, rule, false);
    }

    async addRBACRule(role_id: string, entity_id: string, p: number): Promise<void> {
        return await this.db.add("role/" + role_id, { _id: entity_id, p }, false);
    }

    async addABACRule(entity_id: string, flag: number, condition: ABACRule<A>["conditions"]): Promise<void> {
        return await this.db.add("abac/"+entity_id, { flag, conditions: condition.toString() }, true);
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