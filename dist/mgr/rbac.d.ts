import { ValtheraCompatible } from "@wxn0brp/db-core";
import { RoleRule } from "../types/system.js";
export declare class RBACManager {
    private db;
    constructor(db: ValtheraCompatible);
    get(roleId: string, entityId: string): Promise<RoleRule>;
    list(roleId: string): Promise<RoleRule[]>;
    add(roleId: string, entityId: string, p: number): Promise<RoleRule>;
    update(roleId: string, entityId: string, p: number): Promise<import("@wxn0brp/db-core/types/data").Data>;
    remove(roleId: string, entityId: string): Promise<RoleRule>;
    removeAll(roleId: string): Promise<import("@wxn0brp/db-core/types/data").Data[]>;
}
