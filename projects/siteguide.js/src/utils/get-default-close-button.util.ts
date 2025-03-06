import { createElement } from './create-element.util';

/**
 * Get default close button
 * @param classPrefix
 * @returns element
 */
export function getDefaultCloseButton(classPrefix: string): HTMLElement {
    const closeButton: HTMLButtonElement = createElement('button', [`${classPrefix}-close`]);
    closeButton.innerHTML = '✖';

    return closeButton;
}
