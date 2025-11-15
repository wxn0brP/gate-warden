import Id from "@wxn0brp/db-core/types/Id";

export const COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
};

export function logAccess(userId: Id, entityId: Id, via: string, debugLog: number) {
    if (debugLog < 1) return;
    console.log(
        `${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
        `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`
    );
}