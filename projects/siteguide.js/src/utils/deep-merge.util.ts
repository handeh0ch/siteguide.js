/**
 * Checks if a value is a plain object (and not an array or null).
 * @param {any} obj - The value to check.
 * @returns {boolean} - `true` if the value is a plain object, otherwise `false`.
 */
export function isObject(obj: any): obj is object {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Deeply merges two objects, recursively combining their properties.
 * If a property exists in both objects and is an object itself, it will be merged deeply.
 * Otherwise, the value from the source object will overwrite the value in the target object.
 * @param {object} target - The target object to merge into.
 * @param {object} source - The source object to merge from.
 * @returns {object} - A new object that is the result of deeply merging the target and source objects.
 */
export function deepMerge<T extends object>(target: T, source: T): T {
    const output = { ...target } as T;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            const sourceKey = key as keyof T;
            const targetKey = key as keyof T;

            if (isObject(source[sourceKey])) {
                if (!(targetKey in target)) {
                    Object.assign(output, { [targetKey]: {} });
                }
                output[targetKey] = deepMerge(target[targetKey] as object, source[sourceKey] as object) as any;
            } else {
                Object.assign(output, { [targetKey]: source[sourceKey] });
            }
        });
    }

    return output;
}
