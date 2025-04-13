import { autoCreate, Valthera } from "@wxn0brp/db";
export function createDb(valthera) {
    if (valthera instanceof Valthera)
        return valthera;
    return autoCreate(valthera);
}
//# sourceMappingURL=createDb.js.map