import { collections } from "../const.js";
export class ABACManager {
    db;
    constructor(db) {
        this.db = db;
    }
    get(entityId, flag) {
        return this.db.c(collections.abac + "/" + entityId).findOne({
            flag,
        });
    }
    list(entityId) {
        return this.db.c(collections.abac + "/" + entityId).find({});
    }
    add(entityId, flag, condition) {
        return this.db.c(collections.abac + "/" + entityId).add({
            flag,
            condition,
        }, true);
    }
    update(entityId, flag, condition) {
        return this.db.c(collections.abac + "/" + entityId).updateOne({
            flag,
        }, {
            condition,
        });
    }
    remove(entityId, flag) {
        return this.db.c(collections.abac + "/" + entityId).removeOne({
            flag,
        });
    }
    removeAll(entityId) {
        return this.db.c(collections.abac + "/" + entityId).remove({});
    }
}
