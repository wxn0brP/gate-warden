import { Id } from "@wxn0brp/db-core";
import { SearchOptions } from "@wxn0brp/db-core/types/searchOpts";

export interface Role {
    _id: Id;
    name: string;
}

export interface RoleEntity {
    _id: Id;
    p: number;
}

export interface ACLRule {
    uid?: Id;
    p: number;
}

export interface ABACRule {
    flag: number;
    condition: Record<string, SearchOptions>;
}

export interface User<A=any> {
    _id: Id;
    roles: Id[];
    attrib: A;
}

export interface AccessResult {
    granted: boolean;
    via: "ACL" | "RBAC" | "ABAC" | "user-404" | "entity-404" | "not-permitted";
}