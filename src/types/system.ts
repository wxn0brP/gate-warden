import { Id } from "@wxn0brp/db";

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

export interface ABACRule<A> {
    flag: number;
    conditions: (user: User<A>, entity: any) => boolean;
}

export interface User<A> {
    _id: Id;
    roles: Id[];
    attrib: A;
}