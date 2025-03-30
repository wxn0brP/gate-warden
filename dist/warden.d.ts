import { DataBase as Valthera } from "@wxn0brp/db";
declare class GateWarden<A = any> {
    debugLog: number;
    private db;
    constructor(valthera: string | Valthera, debugLog?: number);
    hasAccess(userId: string, entityId: string, flag: number): Promise<boolean>;
}
export default GateWarden;
//# sourceMappingURL=warden.d.ts.map