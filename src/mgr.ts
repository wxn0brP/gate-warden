import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACManager } from "./mgr/abac";
import { ACLManager } from "./mgr/acl";
import { RBACManager } from "./mgr/rbac";
import { RoleManager } from "./mgr/role";
import { ABACRule, Role } from "./types/system";

export class WardenManager {
	readonly role: RoleManager;
	readonly acl: ACLManager;
	readonly rbac: RBACManager;
	readonly abac: ABACManager;

	constructor(db: ValtheraCompatible) {
		this.role = new RoleManager(db);
		this.acl = new ACLManager(db);
		this.rbac = new RBACManager(db);
		this.abac = new ABACManager(db);
	}

	/** @deprecated */
	changeRoleNameToId(name: string) {
		return this.role.findByName(name);
	}

	/** @deprecated */
	roleExists(roleId: Id) {
		return this.role.exists(roleId);
	}

	/** @deprecated */
	addRole(role: Role | Omit<Role, "_id">) {
		return this.role.add(role);
	}

	/** @deprecated */
	removeRole(roleId: string) {
		return this.role.remove(roleId);
	}

	/** @deprecated */
	addACLRule(entityId: string, p: number, uid?: Id) {
		return this.acl.add(entityId, p, uid);
	}

	/** @deprecated */
	removeACLRule(entityId: string, uid?: string) {
		return this.acl.remove(entityId, uid);
	}

	/** @deprecated */
	addRBACRule(roleId: string, entityId: string, p: number) {
		return this.rbac.add(roleId, entityId, p);
	}

	/** @deprecated */
	removeRBACRule(roleId: string, entityId: string) {
		return this.rbac.remove(roleId, entityId);
	}

	/** @deprecated */
	addABACRule(
		entityId: string,
		flag: number,
		condition: ABACRule["condition"],
	) {
		return this.abac.add(entityId, flag, condition);
	}

	/** @deprecated */
	removeABACRule(entityId: string, flag: number) {
		return this.abac.remove(entityId, flag);
	}
}
