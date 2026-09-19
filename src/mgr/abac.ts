import { ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule } from "../types/system";
import { collections } from "../const";

export class ABACManager {
	constructor(private db: ValtheraCompatible) {}

	get(entityId: string, flag: number) {
		return this.db.c<ABACRule>(collections.abac + "/" + entityId).findOne({
			flag,
		});
	}

	list(entityId: string) {
		return this.db.c<ABACRule>(collections.abac + "/" + entityId).find({});
	}

	add(entityId: string, flag: number, condition: ABACRule["condition"]) {
		return this.db.c<ABACRule>(collections.abac + "/" + entityId).add(
			{
				flag,
				condition,
			},
			true,
		);
	}

	update(entityId: string, flag: number, condition: ABACRule["condition"]) {
		return this.db.c(collections.abac + "/" + entityId).updateOne(
			{
				flag,
			},
			{
				condition,
			},
		);
	}

	remove(entityId: string, flag: number) {
		return this.db.c<ABACRule>(collections.abac + "/" + entityId).removeOne({
			flag,
		});
	}

	removeAll(entityId: string) {
		return this.db.c(collections.abac + "/" + entityId).remove({});
	}
}
