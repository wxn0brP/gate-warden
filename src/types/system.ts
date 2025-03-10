import { Id } from "@wxn0brp/db";

export interface Role {
    id: Id;
    p: number;
}

export interface ACLRule {
    entityId: Id;
    userId?: Id;
    p: number;
}

export interface ABACRule<A> {
    flag: number;
    conditions: (user: User<A>, entity: any) => boolean;
}

export interface User<A> {
    id: Id;
    roles: Id[];
    attrib: A;
}