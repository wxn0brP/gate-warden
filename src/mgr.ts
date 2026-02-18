import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule, ACLRule, Role, RoleRule } from "./types/system";
import { collections } from "./const";

export class WardenManager {
    constructor(private db: ValtheraCompatible) { }

    changeRoleNameToId(name: string): Promise<Id> {
        return this.db.c<Role>(collections.roles).findOne({ name }).then((r) => r._id);
    }

    // ADD
    addRole(role: Role | Omit<Role, "_id">): Promise<Role> {
        return this.db.c<Role>(collections.roles).add(role);
    }

    addACLRule(entityId: string, p: number, uid?: Id): Promise<ACLRule> {
        const rule: ACLRule = { p };
        if (uid) rule.uid = uid;
        return this.db.c<ACLRule>(collections.acl + "/" + entityId).add(rule, false);
    }

    addRBACRule(role_id: string, entity_id: string, p: number): Promise<RoleRule> {
        return this.db.c<RoleRule>(collections.role + "/" + role_id).add({ _id: entity_id, p }, false);
    }

    addABACRule(entity_id: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule> {
        return this.db.c<ABACRule>(collections.abac + "/" + entity_id).add({ flag, condition }, true);
    }

    // DELETE
    removeRole(roleId: string): Promise<Role | null> {
        return this.db.c<Role>(collections.roles).removeOne({ _id: roleId });
    }

    removeACLRule(entityId: string, uid?: string): Promise<ACLRule | null> {
        const q: any = uid ? { uid } : { $not: { $exists: { "uid": true } } };
        return this.db.c<ACLRule>(collections.acl + "/" + entityId).removeOne(q);
    }

    removeRBACRule(roleId: string, entityId: string): Promise<RoleRule | null> {
        return this.db.c<RoleRule>(collections.role + "/" + roleId).removeOne({ _id: entityId });
    }

    removeABACRule(entityId: string, flag: number): Promise<ABACRule | null> {
        return this.db.c<ABACRule>(collections.abac + "/" + entityId).removeOne({ flag });
    }
}
