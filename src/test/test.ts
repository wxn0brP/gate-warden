import { GateWarden, UserManager } from "..";
import sourceMapSupport from "source-map-support";
import { DataBase as Valthera } from "@wxn0brp/db";
import fCPU from "./ramStorage";
sourceMapSupport.install();

type UserAttributes = {
    dep: string;
    level: number;
};

enum PermissionFlags {
    VIEW = 1 << 0,
    EDIT = 1 << 1,
    DELETE = 1 << 2,
    ADMIN = 1 << 3,
}

const db = new Valthera("test.db", {}, fCPU);
const gw = new GateWarden<UserAttributes>(db, 2);

await gw.addRole({ id: "admin", p: PermissionFlags.VIEW | PermissionFlags.EDIT | PermissionFlags.DELETE | PermissionFlags.ADMIN });
await gw.addRole({ id: "user", p: PermissionFlags.VIEW });
await gw.addRole({ id: "manager", p: PermissionFlags.VIEW | PermissionFlags.EDIT });

await gw.addUser({ id: "alice", roles: ["user"], attrib: { dep: "HR", level: 1 } });
await gw.addUser({ id: "bob", roles: ["manager"], attrib: { dep: "IT", level: 7 } });
await gw.addUser({ id: "charlie", roles: ["admin"], attrib: { dep: "IT", level: 5 } });

await gw.addACLRule({ entityId: "doc123", userId: "alice", p: PermissionFlags.EDIT });

await gw.addABACRule(PermissionFlags.DELETE, (user, entity) => user.attrib.level >= 4);

const log = (result: boolean, required: boolean = true) => console.log(result === required ? "OK" : "FAIL");

log(await gw.hasAccess("alice", "doc123", PermissionFlags.VIEW), true);
log(await gw.hasAccess("alice", "doc123", PermissionFlags.EDIT), true);
log(await gw.hasAccess("alice", "doc999", PermissionFlags.EDIT), false);
log(await gw.hasAccess("bob", "doc123", PermissionFlags.DELETE), true);
log(await gw.hasAccess("charlie", "doc123", PermissionFlags.DELETE)), true;
log(await gw.hasAccess("alice", "doc123", PermissionFlags.DELETE), false);

const userManager = new UserManager<UserAttributes>(db);
await userManager.updateAttributes("bob", { level: 1 });
log(await gw.hasAccess("bob", "doc123", PermissionFlags.DELETE), false);