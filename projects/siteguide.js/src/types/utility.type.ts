/**
 * Represents a deep required type, ensuring all properties of an object are required and recursively applies to nested objects
 * @template T The type to make deep required
 * @returns A type that represents a deep required version of T
 */
export type DeepRequired<T> = T extends (...args: any[]) => any
    ? T
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T;
