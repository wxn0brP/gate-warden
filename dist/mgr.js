import { collections } from "./const.js";
export class WardenManager {
    db;
    constructor(db) {
        this.db = db;
    }
    async changeRoleNameToId(name) {
        return await this.db.findOne(collections.roles, { name }).then((r) => r._id);
    }
    // ADD
    async addRole(role) {
        return await this.db.add(collections.roles, role);
    }
    async addACLRule(entityId, p, uid) {
        const rule = { p };
        if (uid)
            rule.uid = uid;
        return await this.db.add(collections.acl + "/" + entityId, rule, false);
    }
    async addRBACRule(role_id, entity_id, p) {
        return await this.db.add(collections.role + "/" + role_id, { _id: entity_id, p }, false);
    }
    async addABACRule(entity_id, flag, condition) {
        return await this.db.add(collections.abac + "/" + entity_id, { flag, condition }, true);
    }
    // DELETE
    async removeRole(roleId) {
        return await this.db.removeOne(collections.roles, { _id: roleId });
    }
    async removeACLRule(entityId, uid) {
        const q = uid ? { uid } : { $not: { $exists: { "uid": true } } };
        return await this.db.removeOne(collections.acl + "/" + entityId, q);
    }
    async removeRBACRule(roleId, entityId) {
        return await this.db.removeOne(collections.role + "/" + roleId, { _id: entityId });
    }
    async removeABACRule(entityId, flag) {
        return await this.db.removeOne(collections.abac + "/" + entityId, { flag });
    }
}
