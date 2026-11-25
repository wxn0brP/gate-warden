import { collections } from "../const.js";
export class ACLManager {
    db;
    constructor(db) {
        this.db = db;
    }
    _createSearch(id) {
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
    get(entityId, uid) {
        return this.db
            .c(collections.acl + "/" + entityId)
            .findOne(this._createSearch(uid));
    }
    list(entityId) {
        return this.db.c(collections.acl + "/" + entityId).find({});
    }
    add(entityId, p, uid) {
        const rule = {
            p,
        };
        if (uid)
            rule.uid = uid;
        return this.db
            .c(collections.acl + "/" + entityId)
            .add(rule, false);
    }
    update(entityId, uid, p) {
        return this.db
            .c(collections.acl + "/" + entityId)
            .updateOne(this._createSearch(uid), {
            p,
        });
    }
    remove(entityId, uid) {
        return this.db
            .c(collections.acl + "/" + entityId)
            .removeOne(this._createSearch(uid));
    }
    removeAll(entityId) {
        return this.db.c(collections.acl + "/" + entityId).remove({});
    }
}
