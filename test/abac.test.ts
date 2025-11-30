import { abacCheck } from "#check";
import { ABACRule, User } from "#types/system";
import { createMemoryValthera } from "@wxn0brp/db-core";
import { describe, expect, it } from "bun:test";

describe("Access Control Checks", () => {
    describe("abacCheck", () => {
        it("should return false when entity has no ABAC collection", async () => {
            const db = createMemoryValthera({});
            const user: User = { _id: "user1", roles: [], attrib: { department: "engineering" } };

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(false);
        });

        it("should return true when user attributes match ABAC rule", async () => {
            const abacRules: ABACRule[] = [
                {
                    flag: 1,
                    condition: {
                        attrib: {
                            department: "engineering"
                        }
                    }
                }
            ];

            const db = createMemoryValthera({
                "abac/entity1": abacRules
            });

            const user: User = { _id: "user1", roles: [], attrib: { department: "engineering" } };

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(true);
        });

        it("should return false when user attributes don't match ABAC rule", async () => {
            const abacRules: ABACRule[] = [
                {
                    flag: 1,
                    condition: {
                        attrib: {
                            department: "engineering"
                        }
                    }
                }
            ];

            const db = createMemoryValthera({
                "abac/entity1": abacRules
            });

            const user: User = { _id: "user1", roles: [], attrib: { department: "marketing" } };

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(false);
        });

        it("should handle nested attribute paths correctly", async () => {
            const abacRules: ABACRule[] = [
                {
                    flag: 1,
                    condition: {
                        "attrib.profile": {
                            level: 5
                        }
                    }
                }
            ];

            const db = createMemoryValthera({
                "abac/entity1": abacRules
            });

            const user: User = {
                _id: "user1",
                roles: [],
                attrib: {
                    profile: {
                        level: 5,
                        name: "test"
                    }
                }
            };

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(true);
        });

        it("should return false when user attributes are undefined", async () => {
            const abacRules: ABACRule[] = [
                {
                    flag: 1,
                    condition: {
                        attrib: {
                            department: "engineering"
                        }
                    }
                }
            ];

            const db = createMemoryValthera({
                "abac/entity1": abacRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} }; // No department

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(false);
        });

        it("should return true when checking user root properties with _", async () => {
            const abacRules: ABACRule[] = [
                {
                    flag: 1,
                    condition: {
                        _: {
                            _id: "user1"
                        }
                    }
                }
            ];

            const db = createMemoryValthera({
                "abac/entity1": abacRules
            });

            const user: User = { _id: "user1", roles: [], attrib: {} };

            const result = await abacCheck({
                db,
                entityId: "entity1",
                flag: 1,
                user,
                debugLog: 0
            });

            expect(result).toBe(true);
        });
    });
});