import { Valthera, ValtheraAutoCreate } from "@wxn0brp/db";
import { Remote } from "@wxn0brp/db/dist/client/remote";

export function createDb(valthera: string | Valthera | Remote): Valthera {
    if (valthera instanceof Valthera) return valthera;
    return ValtheraAutoCreate(valthera) as Valthera;
}