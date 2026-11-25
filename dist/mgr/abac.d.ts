import { ValtheraCompatible } from "@wxn0brp/db-core";
import { ABACRule } from "../types/system.js";
export declare class ABACManager {
    private db;
    constructor(db: ValtheraCompatible);
    get(entityId: string, flag: number): Promise<ABACRule>;
    list(entityId: string): Promise<ABACRule[]>;
    add(entityId: string, flag: number, condition: ABACRule["condition"]): Promise<ABACRule & {
        _id: string;
    }>;
    update(entityId: string, flag: number, condition: ABACRule["condition"]): Promise<import("@wxn0brp/db-core/types/data").Data>;
    remove(entityId: string, flag: number): Promise<ABACRule>;
    removeAll(entityId: string): Promise<import("@wxn0brp/db-core/types/data").Data[]>;
}
