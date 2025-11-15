import { createMemoryValthera } from "@wxn0brp/db-core";
import { describe, expect, it } from "bun:test";
import { rbacCheck } from "../check.js";
describe("Access Control Checks", () => {
    describe("rbacCheck", () => {
        it("should return true when user has role with the required flag", async () => {
            const rolesData = [
                { _id: "resource1", p: 5 } // Flags 1 and 4
            ];
            const db = createMemoryValthera({
                "role/admin": rolesData
            });
            const user = { _id: "user1", roles: ["admin"], attrib: {} };
            // Check for flag 1 (should be granted by admin role)
            const result = await rbacCheck({
                db,
                entityId: "resource1",
                flag: 1,
                user
            });
            expect(result).toBe(true);
        });
        it("should return false when user has role without the required flag", async () => {
            const rolesData = [
                { _id: "resource1", p: 4 } // Only flag 4
            ];
            const db = createMemoryValthera({
                "role/admin": rolesData
            });
            const user = { _id: "user1", roles: ["admin"], attrib: {} };
            // Check for flag 1 (should not be granted)
            const result = await rbacCheck({
                db,
                entityId: "resource1",
                flag: 1,
                user
            });
            expect(result).toBe(false);
        });
        it("should return false when user has no matching role-entity permissions", async () => {
            const rolesData = [
                { _id: "resource2", p: 1 } // Different resource
            ];
            const db = createMemoryValthera({
                "role/admin": rolesData
            });
            const user = { _id: "user1", roles: ["admin"], attrib: {} };
            // Check for resource1 when only resource2 permissions exist
            const result = await rbacCheck({
                db,
                entityId: "resource1",
                flag: 1,
                user
            });
            expect(result).toBe(false);
        });
        it("should return false when user has no roles", async () => {
            const db = createMemoryValthera({});
            const user = { _id: "user1", roles: [], attrib: {} };
            const result = await rbacCheck({
                db,
                entityId: "resource1",
                flag: 1,
                user
            });
            expect(result).toBe(false);
        });
    });
});
