import { TourButtonConfig } from '../../types/button-config.type';
import { PopupData } from '../../types/popup.type';
import { PopupCloseIconElement, RequiredTourConfig } from '../../types/tour-config.type';
import { isNullOrUndefined } from '../../utils/base.util';
import { createElement } from '../../utils/create-element.util';

/**
 * Updates the layout of a popup element by clearing its content and adding new elements
 * such as a header, exit button, content area, and a collection of buttons.
 * @param {HTMLElement} popup - The popup element to be updated.
 * @param {PopupData} popupData - The data containing configuration for the popup, including button configurations.
 * @param {RequiredTourConfig} tourConfig - The configuration object for the tour.
 * @param {() => void} closeClick - The function to be called when the close button is clicked.
 */
export function updatePopupLayout(
    popup: HTMLElement,
    popupData: PopupData,
    tourConfig: RequiredTourConfig,
    closeClick: () => void
): void {
    popup.innerHTML = '';

    const header: HTMLDivElement = createElement('div', [
        `${tourConfig.classPrefix}-header`,
        `${popupData.customization?.headerClass ?? ''}`,
    ]);
    popup.appendChild(header);

    const title: HTMLHeadElement = createElement('h1', [
        `${tourConfig.classPrefix}-title`,
        `${popupData.customization?.titleClass ?? ''}`,
    ]);
    title.innerHTML = popupData.title ?? '';
    header.appendChild(title);

    if (tourConfig.allowClose) {
        const closeButton: HTMLButtonElement = createElement('button', [
            `${tourConfig.classPrefix}-close`,
            `${popupData.customization?.closeButtonClass ?? ''}`,
        ]);
        resolveCloseIcon(closeButton, tourConfig.closeIcon);
        closeButton.onclick = closeClick;
        header.appendChild(closeButton);
    }

    const content: HTMLDivElement = createElement('div', [
        `${tourConfig.classPrefix}-content`,
        `${popupData.customization?.contentClass ?? ''}`,
    ]);
    popup.appendChild(content);

    const buttonCollection: HTMLDivElement = createElement('div', [
        `${tourConfig.classPrefix}-footer`,
        `${popupData.customization?.footerClass ?? ''}`,
    ]);

    popupData.buttonCollection.forEach((button: TourButtonConfig) => {
        const buttonClassList: string[] = [`${tourConfig.classPrefix}-button`, button.class ?? ''];
        if (isNullOrUndefined(button.type) || button.type === 'secondary') {
            buttonClassList.push(`${tourConfig.classPrefix}-button-secondary`);
        } else if (button.type === 'primary') {
            buttonClassList.push(`${tourConfig.classPrefix}-button-primary`);
        }

        if (!isNullOrUndefined(button.class) && button.class !== '') {
            buttonClassList.push(button.class);
        }

        const buttonElement: HTMLButtonElement = createElement('button', buttonClassList);

        buttonElement.innerText = button.text;

        buttonElement.onclick = (): void => {
            button.action();
        };

        buttonCollection.appendChild(buttonElement);
    });

    popup.appendChild(buttonCollection);
}

/**
 * Resolves the close icon for the popup by appending or setting the innerHTML of the closeButton.
 * @param {HTMLButtonElement} closeButton - The button element that will display the close icon.
 * @param {PopupCloseIconElement} icon - The close icon to be resolved. It can be an HTMLElement or an InnerHTML object.
 */
function resolveCloseIcon(closeButton: HTMLButtonElement, icon: PopupCloseIconElement): void {
    if (icon instanceof HTMLElement) {
        closeButton.appendChild(icon);
    } else {
        closeButton.innerHTML = icon.innerHTML;
    }
}
