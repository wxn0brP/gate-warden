import { collections } from "../const.js";
export class RBACManager {
    db;
    constructor(db) {
        this.db = db;
    }
    get(roleId, entityId) {
        return this.db.c(collections.role + "/" + roleId).findOne({
            _id: entityId,
        });
    }
    list(roleId) {
        return this.db.c(collections.role + "/" + roleId).find({});
    }
    add(roleId, entityId, p) {
        return this.db.c(collections.role + "/" + roleId).add({
            _id: entityId,
            p,
        }, false);
    }
    update(roleId, entityId, p) {
        return this.db.c(collections.role + "/" + roleId).updateOne({
            _id: entityId,
        }, {
            p,
        });
    }
    remove(roleId, entityId) {
        return this.db.c(collections.role + "/" + roleId).removeOne({
            _id: entityId,
        });
    }
    removeAll(roleId) {
        return this.db.c(collections.role + "/" + roleId).remove({});
    }
}
