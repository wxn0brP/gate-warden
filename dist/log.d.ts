import { Id } from "@wxn0brp/db-core/types/Id";
export declare const COLORS: {
    reset: string;
    green: string;
    yellow: string;
    red: string;
    blue: string;
};
export declare function logAccess(userId: Id, entityId: Id, via: string, debugLog: number): void;
