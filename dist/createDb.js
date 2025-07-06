import { Valthera, ValtheraAutoCreate } from "@wxn0brp/db";
export function createDb(valthera) {
    if (valthera instanceof Valthera)
        return valthera;
    return ValtheraAutoCreate(valthera);
}
//# sourceMappingURL=createDb.js.map