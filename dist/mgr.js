import { ABACManager } from "./mgr/abac.js";
import { ACLManager } from "./mgr/acl.js";
import { RBACManager } from "./mgr/rbac.js";
import { RoleManager } from "./mgr/role.js";
export class WardenManager {
    role;
    acl;
    rbac;
    abac;
    constructor(db) {
        this.role = new RoleManager(db);
        this.acl = new ACLManager(db);
        this.rbac = new RBACManager(db);
        this.abac = new ABACManager(db);
    }
    /** @deprecated */
    changeRoleNameToId(name) {
        return this.role.findByName(name);
    }
    /** @deprecated */
    roleExists(roleId) {
        return this.role.exists(roleId);
    }
    /** @deprecated */
    addRole(role) {
        return this.role.add(role);
    }
    /** @deprecated */
    removeRole(roleId) {
        return this.role.remove(roleId);
    }
    /** @deprecated */
    addACLRule(entityId, p, uid) {
        return this.acl.add(entityId, p, uid);
    }
    /** @deprecated */
    removeACLRule(entityId, uid) {
        return this.acl.remove(entityId, uid);
    }
    /** @deprecated */
    addRBACRule(roleId, entityId, p) {
        return this.rbac.add(roleId, entityId, p);
    }
    /** @deprecated */
    removeRBACRule(roleId, entityId) {
        return this.rbac.remove(roleId, entityId);
    }
    /** @deprecated */
    addABACRule(entityId, flag, condition) {
        return this.abac.add(entityId, flag, condition);
    }
    /** @deprecated */
    removeABACRule(entityId, flag) {
        return this.abac.remove(entityId, flag);
    }
}
