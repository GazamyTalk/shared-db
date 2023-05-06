export function assertUndefinedValue(obj: {[key: string] : any}, name: string) : void {
    const keys = Object.keys(obj);
    const values = keys.map((value) => obj[value]);
    values.forEach((value, index) => {
        if (value === undefined) {
            throw new Error(`Configuration Error: ${name}.${keys[index]} is undefined`)
        }
    });
}