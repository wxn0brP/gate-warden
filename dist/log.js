export const COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
};
export function logAccess(userId, entityId, via, debugLog) {
    if (debugLog < 1)
        return;
    console.log(`${COLORS.green}[GW] Access granted to ${COLORS.yellow}${entityId}${COLORS.green} via ` +
        `${COLORS.yellow}${via}${COLORS.green} by ${COLORS.yellow}${userId}${COLORS.reset}`);
}
