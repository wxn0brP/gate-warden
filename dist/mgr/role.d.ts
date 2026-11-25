import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { Role } from "../types/system.js";
export declare class RoleManager {
    private db;
    constructor(db: ValtheraCompatible);
    get(roleId: Id): Promise<Role>;
    list(): Promise<Role[]>;
    add(role: Role | Omit<Role, "_id">): Promise<Role & {
        _id: string;
    }>;
    update(roleId: Id, data: Partial<Omit<Role, "_id">>): Promise<import("@wxn0brp/db-core/types/data").Data>;
    remove(roleId: Id): Promise<Role>;
    exists(roleId: Id): Promise<boolean>;
    findByName(name: string): Promise<string>;
}
