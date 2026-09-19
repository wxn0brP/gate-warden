import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ACLRule } from "../types/system";
import { collections } from "../const";

export class ACLManager {
	constructor(private db: ValtheraCompatible) {}

	_createSearch(id?: Id) {
		if (id)
			return {
				uid: id,
			};
		return {
			$not: {
				$exists: {
					uid: true,
				},
			},
		};
	}

	get(entityId: string, uid?: Id) {
		return this.db
			.c<ACLRule>(collections.acl + "/" + entityId)
			.findOne(this._createSearch(uid));
	}

	list(entityId: string) {
		return this.db.c<ACLRule>(collections.acl + "/" + entityId).find({});
	}

	add(entityId: string, p: number, uid?: Id) {
		const rule: ACLRule = {
			p,
		};
		if (uid) rule.uid = uid;
		return this.db
			.c<ACLRule>(collections.acl + "/" + entityId)
			.add(rule, false);
	}

	update(entityId: string, uid: Id | undefined, p: number) {
		return this.db
			.c(collections.acl + "/" + entityId)
			.updateOne(this._createSearch(uid), {
				p,
			});
	}

	remove(entityId: string, uid?: Id) {
		return this.db
			.c<ACLRule>(collections.acl + "/" + entityId)
			.removeOne(this._createSearch(uid));
	}

	removeAll(entityId: string) {
		return this.db.c(collections.acl + "/" + entityId).remove({});
	}
}
