/**
 * Creates an HTML element with the specified tag name and applies the given class list.
 * @template T
 * @param {T} tagName - The name of the HTML tag to create.
 * @param {string[]} [classList] - An array of class names to add to the created element.
 * @returns {HTMLElementTagNameMap[T]} The created HTML element with the specified tag name and class list.
 */
export function createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    classList?: string[]
): HTMLElementTagNameMap[T] {
    const element: HTMLElementTagNameMap[T] = document.createElement(tagName);

    if (classList && classList.length > 0) {
        classList = classList.filter((className: string) => className);
        element.classList.add(...classList);
    }

    return element;
}
