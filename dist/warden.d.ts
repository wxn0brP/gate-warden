import { ValtheraCompatible } from "@wxn0brp/db-core";
import { AccessResult } from "./types/system.js";
declare class GateWarden<A = any> {
    private db;
    debugLog: number;
    constructor(db: ValtheraCompatible, debugLog?: number);
    hasAccess(userId: string, entityId: string, flag: number): Promise<AccessResult>;
}
export default GateWarden;
