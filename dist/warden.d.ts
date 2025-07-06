import { Valthera } from "@wxn0brp/db";
import { AccessResult } from "./types/system.js";
declare class GateWarden<A = any> {
    debugLog: number;
    private db;
    constructor(valthera: string | Valthera, debugLog?: number);
    hasAccess(userId: string, entityId: string, flag: number): Promise<AccessResult>;
}
export default GateWarden;
