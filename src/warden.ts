import { Id, DataBase as Valthera } from "@wxn0brp/db";
import { ABACRule, ACLRule, Role, User } from "./types/system";
import { COLORS } from "./log";

class GateWarden<A> {
    private db: Valthera;

    constructor(valthera: string | Valthera, public debugLog: number = 0) {
        this.db = typeof valthera === "string" ? new Valthera(valthera) : valthera;
    }

    private _logAccess(userId: Id, entityId: Id, via: string) {
        if (this.debugLog < 1) return;
        console.log(
            `${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
            `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`
        );
    }

    private async _fetchUser(userId: Id): Promise<User<A>> {
        const user = await this.db.findOne<User<A>>("users", { id: userId });
        if (!user) throw new Error("User not found");
        return user;
    }

    private async _aclCheck(entityId: Id, flag: number, user: User<A>): Promise<boolean> {
        const rules = await this.db.find<ACLRule>("acl_rules", { entityId });
        for (const rule of rules) {
            if (rule.userId && rule.userId !== user.id) continue;
            if (rule.p & flag) return true;
        }
        return false;
    }

    private async _rbacCheck(entityId: Id, flag: number, user: User<A>): Promise<boolean> {
        const roles = await this.db.find<Role>("roles", { $in: { id: user.roles } });
        const rolePermissions = (roles || []).reduce((acc, r) => acc | r.p, 0);
        if (this.debugLog >= 1)
            console.log(
                COLORS.blue + `[GW] User ${COLORS.yellow}${user.id}${COLORS.blue} has role permissions: ` +
                `${COLORS.yellow}${rolePermissions}` + COLORS.reset
            );
        return !!(rolePermissions & flag);
    }

    private async _abacCheck(entityId: Id, flag: number, user: User<A>): Promise<boolean> {
        const rules = await this.db.find<ABACRule<A>>("abac_rules", { flag });
        for (const rule of rules) {
            try {
                const conditions = new Function("user", "entity", `return ${rule.conditions}`)();
                if (this.debugLog >= 1)
                    console.log(
                        COLORS.blue + `[GW] ABAC rule: ${COLORS.yellow}${rule.conditions}${COLORS.blue} ` +
                        `-> ${COLORS.yellow}${conditions(user, entityId)}` + COLORS.reset
                    );

                if (conditions(user, entityId)) return true;
            } catch (e) {
                if (this.debugLog >= 1) console.log(COLORS.red + `[GW] ABAC rule error: ${e}` + COLORS.reset);
            }
        }
        return false;
    }

    async hasAccess(userId: string, entityId: string, flag: number): Promise<boolean> {
        const user = await this._fetchUser(userId);
        if (!user) {
            if (this.debugLog >= 1) console.log(COLORS.red + "[GW] User not found." + COLORS.reset);
            return false;
        }

        if (await this._aclCheck(entityId, flag, user)) {
            this._logAccess(userId, entityId, "ACL");
            return true;
        }

        if (await this._rbacCheck(entityId, flag, user)) {
            this._logAccess(userId, entityId, "RBAC");
            return true;
        }

        if (await this._abacCheck(entityId, flag, user)) {
            this._logAccess(userId, entityId, "ABAC");
            return true;
        }

        if (this.debugLog >= 1) console.log(COLORS.red + `[GW] Access denied to ${entityId} by ${userId}.` + COLORS.reset);
        return false;
    }

    async addUser(user: User<A>): Promise<void> {
        return await this.db.add("users", user, false);
    }

    async addRole(role: Role): Promise<void> {
        return await this.db.add("roles", role, false);
    }

    async addACLRule(rule: ACLRule): Promise<void> {
        return await this.db.add("acl_rules", rule, false);
    }

    async addABACRule(flag: number, condition: ABACRule<A>["conditions"]): Promise<void> {
        return await this.db.add("abac_rules", { flag, conditions: condition.toString() }, false);
    }
}

export default GateWarden;