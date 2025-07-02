import { Valthera, ValtheraAutoCreate } from "@wxn0brp/db";
import { Remote } from "@wxn0brp/db/client/remote.js";

export function createDb(valthera: string | Valthera | Remote): Valthera {
    if (valthera instanceof Valthera) return valthera;
    return ValtheraAutoCreate(valthera) as Valthera;
}