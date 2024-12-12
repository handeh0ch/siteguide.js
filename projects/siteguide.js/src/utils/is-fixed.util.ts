import type { Position } from '../types/position.type';

/**
 * Determines if the specified HTMLElement or any of its ancestors have a fixed position.
 *
 * This function recursively checks the position property of the element and its parents up to the HTML element.
 * @param {HTMLElement} element - The HTMLElement to start checking from.
 * @returns {boolean} Returns true if the element or any of its parents have a fixed position, otherwise returns false.
 */
export function isFixed(element: HTMLElement): boolean {
    const parent = element.parentElement;

    if (!parent || parent.nodeName === 'HTML') {
        return false;
    }

    const propValue: string | undefined = document.defaultView
        ?.getComputedStyle(element, null)
        .getPropertyValue('position');

    if (propValue === 'fixed') {
        return true;
    }

    return isFixed(parent);
}

/**
 * Determines the position of the specified HTMLElement based on whether it or any of its ancestors have a fixed position.
 *
 * This function calls `isFixed` to check if the element or any of its parents have a fixed position.
 * If so, it returns 'fixed', otherwise it returns 'absolute'.
 * @param {HTMLElement} element - The HTMLElement to check the position for.
 * @returns {Position} Returns 'fixed' if the element or any of its parents have a fixed position, otherwise returns 'absolute'.
 */
export function getPositionType(element: HTMLElement): Position {
    return isFixed(element) ? 'fixed' : 'absolute';
}
