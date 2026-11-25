import { collections } from "../const.js";
export class RoleManager {
    db;
    constructor(db) {
        this.db = db;
    }
    get(roleId) {
        return this.db.c(collections.roles).findOne({
            _id: roleId,
        });
    }
    list() {
        return this.db.c(collections.roles).find({});
    }
    add(role) {
        return this.db.c(collections.roles).add(role);
    }
    update(roleId, data) {
        return this.db.c(collections.roles).updateOne({
            _id: roleId,
        }, {
            ...data,
        });
    }
    remove(roleId) {
        return this.db.c(collections.roles).removeOne({
            _id: roleId,
        });
    }
    async exists(roleId) {
        return !!(await this.get(roleId));
    }
    async findByName(name) {
        const r = await this.db.c(collections.roles).findOne({
            name,
        });
        return r?._id;
    }
}
