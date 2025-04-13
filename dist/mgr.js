import { createDb } from "./createDb.js";
class WardenManager {
    db;
    constructor(valthera) {
        this.db = createDb(valthera);
    }
    async changeRoleNameToId(name) {
        return await this.db.findOne("roles", { name });
    }
    // ADD
    async addRole(role) {
        return await this.db.add("roles", role);
    }
    async addACLRule(entityId, p, uid) {
        const rule = { p };
        if (uid)
            rule.uid = uid;
        return await this.db.add("acl/" + entityId, rule, false);
    }
    async addRBACRule(role_id, entity_id, p) {
        return await this.db.add("role/" + role_id, { _id: entity_id, p }, false);
    }
    async addABACRule(entity_id, flag, condition) {
        return await this.db.add("abac/" + entity_id, { flag, conditions: condition.toString() }, true);
    }
    // DELETE
    async removeRole(roleId) {
        return await this.db.removeOne("roles", { roleId });
    }
    async removeACLRule(entityId, uid) {
        const q = uid ? { uid } : { $not: { $exists: { "uid": true } } };
        return await this.db.removeOne("acl/" + entityId, q);
    }
    async removeRBACRule(roleId, entityId) {
        return await this.db.removeOne("role/" + roleId, { _id: entityId });
    }
    async removeABACRule(entityId, flag) {
        return await this.db.removeOne("abac/" + entityId, { flag });
    }
}
export default WardenManager;
//# sourceMappingURL=mgr.js.map