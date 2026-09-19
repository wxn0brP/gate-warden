import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { Role } from "../types/system";
import { collections } from "../const";

export class RoleManager {
	constructor(private db: ValtheraCompatible) {}

	get(roleId: Id) {
		return this.db.c<Role>(collections.roles).findOne({
			_id: roleId,
		});
	}

	list() {
		return this.db.c<Role>(collections.roles).find({});
	}

	add(role: Role | Omit<Role, "_id">) {
		return this.db.c<Role>(collections.roles).add(role);
	}

	update(roleId: Id, data: Partial<Omit<Role, "_id">>) {
		return this.db.c(collections.roles).updateOne(
			{
				_id: roleId,
			},
			{
				...data,
			},
		);
	}

	remove(roleId: Id) {
		return this.db.c<Role>(collections.roles).removeOne({
			_id: roleId,
		});
	}

	async exists(roleId: Id) {
		return !!(await this.get(roleId));
	}

	async findByName(name: string) {
		const r = await this.db.c<Role>(collections.roles).findOne({
			name,
		});
		return r?._id;
	}
}
