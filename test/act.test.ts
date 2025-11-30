import { aclCheck } from "#check";
import { ACLRule, User } from "#types/system";
import { createMemoryValthera, ValtheraCompatible } from "@wxn0brp/db-core";
import { describe, expect, it } from "bun:test";

describe("Access Control Checks", () => {
    describe("aclCheck", () => {
        it("should return -1 when entity has no ACL collection", async () => {
            const db: ValtheraCompatible = createMemoryValthera({});
            const user: User = { _id: "user1", roles: [], attrib: {} };

            const result = await aclCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user
            });

            expect(result).toBe(-1);
        });

        it("should return 1 when user has the specific flag in ACL", async () => {
            const aclRules: ACLRule[] = [
                { uid: "user1", p: 5 } // User has flags 1 and 4 (1 | 4 = 5)
            ];

            const db = createMemoryValthera({
                "acl/entity1": aclRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} };

            // Check for flag 1 (should be granted)
            const result = await aclCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user
            });

            expect(result).toBe(1);
        });

        it("should return 0 when user does not have the flag in ACL", async () => {
            const aclRules: ACLRule[] = [
                { uid: "user1", p: 4 } // User has only flag 4
            ];

            const db = createMemoryValthera({
                "acl/entity1": aclRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} };

            // Check for flag 1 (should not be granted)
            const result = await aclCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user
            });

            expect(result).toBe(0);
        });

        it("should return 1 when there is a public rule with the flag", async () => {
            const aclRules: ACLRule[] = [
                { p: 3 } // Public rule with flags 1 and 2
            ];

            const db = createMemoryValthera({
                "acl/entity1": aclRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} };

            // Check for flag 1 (should be granted via public rule)
            const result = await aclCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user
            });

            expect(result).toBe(1);
        });

        it("should return -1 when no rules match the user or public access", async () => {
            const aclRules: ACLRule[] = [
                { uid: "user2", p: 1 } // Different user has the flag
            ];

            const db = createMemoryValthera({
                "acl/entity1": aclRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} };

            const result = await aclCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user
            });

            expect(result).toBe(-1);
        });
    });
});