/**
 * Checks if a value is null or undefined.
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is null or undefined, false otherwise.
 */
export function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || typeof value === 'undefined';
}

/**
 * Checks if a value is null or undefined.
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is null or undefined, false otherwise.
 */
export function isDefined<T>(value: T): value is Exclude<T, null | undefined> {
    return !isNullOrUndefined(value);
}
/**
 * Delays the execution of code for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
