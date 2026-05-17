export function convertPath(user, path) {
    const keys = path.split(".");
    let data = user;
    for (const key of keys) {
        data = data?.[key];
        if (data === undefined)
            return undefined;
    }
    return data;
}
