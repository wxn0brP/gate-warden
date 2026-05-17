import { collections } from "./const.js";
export class WardenManager {
    db;
    constructor(db) {
        this.db = db;
    }
    changeRoleNameToId(name) {
        return this.db.c(collections.roles).findOne({ name }).then((r) => r._id);
    }
    // ADD
    addRole(role) {
        return this.db.c(collections.roles).add(role);
    }
    addACLRule(entityId, p, uid) {
        const rule = { p };
        if (uid)
            rule.uid = uid;
        return this.db.c(collections.acl + "/" + entityId).add(rule, false);
    }
    addRBACRule(role_id, entity_id, p) {
        return this.db.c(collections.role + "/" + role_id).add({ _id: entity_id, p }, false);
    }
    addABACRule(entity_id, flag, condition) {
        return this.db.c(collections.abac + "/" + entity_id).add({ flag, condition }, true);
    }
    // DELETE
    removeRole(roleId) {
        return this.db.c(collections.roles).removeOne({ _id: roleId });
    }
    removeACLRule(entityId, uid) {
        const q = uid ? { uid } : { $not: { $exists: { "uid": true } } };
        return this.db.c(collections.acl + "/" + entityId).removeOne(q);
    }
    removeRBACRule(roleId, entityId) {
        return this.db.c(collections.role + "/" + roleId).removeOne({ _id: entityId });
    }
    removeABACRule(entityId, flag) {
        return this.db.c(collections.abac + "/" + entityId).removeOne({ flag });
    }
}
