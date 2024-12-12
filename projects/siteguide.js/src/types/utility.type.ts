/**
 * Represents a deep required type, ensuring all properties of an object are required and recursively applies to nested objects
 * @template T The type to make deep required
 * @returns A type that represents a deep required version of T
 */
export type DeepRequired<T> = Required<{
    [Prop in keyof T]: T[Prop] extends object | undefined ? DeepRequired<Required<T[Prop]>> : T[Prop];
}>;
