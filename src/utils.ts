export function convertPath(user: any, path: string): any {
    const keys = path.split(".");
    let data = user;
    for (const key of keys) {
        data = data?.[key];
        if (data === undefined) return undefined;
    }
    return data;
}