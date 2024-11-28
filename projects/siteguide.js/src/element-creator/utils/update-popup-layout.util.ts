import { ButtonConfig } from '../../types/button-config.type';
import { PopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';

/**
 * Updates the layout of a popup element by clearing its content and adding new elements
 * such as a header, exit button, content area, and a collection of buttons.
 * @param {HTMLElement} popup - The popup element to be updated.
 * @param {PopupData} popupData - The data containing configuration for the popup, including button configurations.
 */
export function updatePopupLayout(popup: HTMLElement, popupData: PopupData): void {
    popup.innerHTML = '';

    const header: HTMLDivElement = createElement('div', ['overview-header']);
    popup.appendChild(header);

    const exitButton: HTMLButtonElement = createElement('button', ['overview-exit-button']);
    header.appendChild(exitButton);

    const content: HTMLDivElement = createElement('div', ['overview-content']);
    popup.appendChild(content);

    const buttonCollection: HTMLDivElement = createElement('div', ['overview-button-list']);

    popupData.buttonCollection.forEach((button: ButtonConfig) => {
        const buttonElement: HTMLButtonElement = createElement('button', ['overview-button', button.className ?? '']);
        buttonElement.innerText = button.title;

        buttonElement.onclick = (): void => {
            button.action();
        };

        buttonCollection.appendChild(buttonElement);
    });

    popup.appendChild(buttonCollection);
}
