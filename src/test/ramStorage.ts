import { CustomFileCpu } from "@wxn0brp/db";

const temp = new Map<string, any[]>();

async function _read(file: string) {
    if (temp.has(file)) return temp.get(file) || [];
    return [];
}

async function _write(file: string, data: any[]) {
    temp.set(file, data);
}

const fCPU = new CustomFileCpu(_read, _write);
export default fCPU;