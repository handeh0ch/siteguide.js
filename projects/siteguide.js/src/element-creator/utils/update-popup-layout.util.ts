import { Tour } from 'tour';
import { ButtonConfig } from '../../types/button-config.type';
import { PopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';

/**
 * Updates the layout of a popup element by clearing its content and adding new elements
 * such as a header, exit button, content area, and a collection of buttons.
 * @param {HTMLElement} popup - The popup element to be updated.
 * @param {PopupData} popupData - The data containing configuration for the popup, including button configurations.
 * @param tour - The tour object that manages the tour steps and layout.
 */
export function updatePopupLayout(popup: HTMLElement, popupData: PopupData, tour: Tour): void {
    popup.innerHTML = '';

    const header: HTMLDivElement = createElement('div', [`${tour.config.classPrefix}-header`]);
    popup.appendChild(header);

    const title: HTMLHeadElement = createElement('h1', [`${tour.config.classPrefix}-title`]);
    title.innerHTML = popupData.title ?? '';
    header.appendChild(title);

    const closeButton: HTMLButtonElement = createElement('button', [`${tour.config.classPrefix}-close`]);
    closeButton.innerHTML = 'x';
    closeButton.onclick = () => {
        tour.complete();
    };
    header.appendChild(closeButton);

    const content: HTMLDivElement = createElement('div', [`${tour.config.classPrefix}-content`]);
    popup.appendChild(content);

    const buttonCollection: HTMLDivElement = createElement('div', [`${tour.config.classPrefix}-footer`]);

    popupData.buttonCollection.forEach((button: ButtonConfig) => {
        const buttonElement: HTMLButtonElement = createElement('button', [
            `${tour.config.classPrefix}-button`,
            button.className ?? '',
        ]);

        buttonElement.innerText = button.text;

        buttonElement.onclick = (): void => {
            button.action();
        };

        buttonCollection.appendChild(buttonElement);
    });

    popup.appendChild(buttonCollection);
}
