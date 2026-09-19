import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { ACLRule } from "../types/system.js";
export declare class ACLManager {
    private db;
    constructor(db: ValtheraCompatible);
    _createSearch(id?: Id): {
        uid: string;
        $not?: undefined;
    } | {
        uid?: undefined;
        $not: {
            $exists: {
                uid: boolean;
            };
        };
    };
    get(entityId: string, uid?: Id): Promise<ACLRule>;
    list(entityId: string): Promise<ACLRule[]>;
    add(entityId: string, p: number, uid?: Id): Promise<ACLRule>;
    update(entityId: string, uid: Id | undefined, p: number): Promise<import("@wxn0brp/db-core/types/data").Data>;
    remove(entityId: string, uid?: Id): Promise<ACLRule>;
    removeAll(entityId: string): Promise<import("@wxn0brp/db-core/types/data").Data[]>;
}
