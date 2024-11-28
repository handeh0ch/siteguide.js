/**
 * Checks if a value is null or undefined.
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is null or undefined, false otherwise.
 */
export function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || typeof value === 'undefined';
}
