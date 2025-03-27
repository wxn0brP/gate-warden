import { Valthera } from "@wxn0brp/db";
import { ABACRule, ACLRule, Role } from "./types/system";

class WardenManager<A = any> {
    private db: any;
    constructor(valthera: string | Valthera) {
        this.db = typeof valthera === "string" ? new Valthera(valthera) : valthera;
    }

    // ADD
    async addRole(role: Role): Promise<void> {
        return await this.db.add("roles", role, false);
    }

    async addACLRule(rule: ACLRule): Promise<void> {
        return await this.db.add("acl_rules", rule, false);
    }

    async addABACRule(flag: number, condition: ABACRule<A>["conditions"]): Promise<void> {
        return await this.db.add("abac_rules", { flag, conditions: condition.toString() }, false);
    }

    // REMOVE
    async removeRole(role_id: string): Promise<void> {
        return await this.db.removeOne("roles", { _id: role_id });
    }

    async removeACLRule(rule_id: string): Promise<void> {
        return await this.db.removeOne("acl_rules", { _id: rule_id });
    }

    async removeABACRule(flag: number): Promise<void> {
        return await this.db.removeOne("abac_rules", { flag });
    }

    // UPDATE
    async updateABACRule(flag: number, condition: ABACRule<A>["conditions"]): Promise<void> {
        return await this.db.update("abac_rules", { flag }, { conditions: condition.toString() });
    }

    async updateRole(role_id: string, updates: Partial<Role>): Promise<void> {
        return await this.db.update("roles", { _id: role_id }, updates);
    }

    async updateACLRule(rule_id: string, updates: Partial<ACLRule>): Promise<void> {
        return await this.db.update("acl_rules", { _id: rule_id }, updates);
    }
}

export default WardenManager;