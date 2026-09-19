import { ValtheraCompatible } from "@wxn0brp/db-core";
import { collections } from "../const";
import { RoleRule } from "../types/system";

export class RBACManager {
	constructor(private db: ValtheraCompatible) {}

	get(roleId: string, entityId: string) {
		return this.db.c<RoleRule>(collections.role + "/" + roleId).findOne({
			_id: entityId,
		});
	}

	list(roleId: string) {
		return this.db.c<RoleRule>(collections.role + "/" + roleId).find({});
	}

	add(roleId: string, entityId: string, p: number) {
		return this.db.c<RoleRule>(collections.role + "/" + roleId).add(
			{
				_id: entityId,
				p,
			},
			false,
		);
	}

	update(roleId: string, entityId: string, p: number) {
		return this.db.c(collections.role + "/" + roleId).updateOne(
			{
				_id: entityId,
			},
			{
				p,
			},
		);
	}

	remove(roleId: string, entityId: string) {
		return this.db.c<RoleRule>(collections.role + "/" + roleId).removeOne({
			_id: entityId,
		});
	}

	removeAll(roleId: string) {
		return this.db.c(collections.role + "/" + roleId).remove({});
	}
}
