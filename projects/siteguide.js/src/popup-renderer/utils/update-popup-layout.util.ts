import { Tour } from '../../tour';
import type { TourButtonConfig } from '../../types/button-config.type';
import type { PopupData } from '../../types/popup.type';
import type { PopupCloseIconElement } from '../../types/tour-config.type';
import { isNullOrUndefined } from '../../utils/base.util';
import { createElement } from '../../utils/create-element.util';

/**
 * Updates the layout of a popup element by clearing its content and adding new elements
 * such as a header, exit button, content area, and a collection of buttons.
 * @param {HTMLElement} popup - The popup element to be updated.
 * @param {PopupData} popupData - The data containing configuration for the popup, including button configurations.
 * @param {Tour} tour - The tour instance.
 */
export function updatePopupLayout(popup: HTMLElement, popupData: PopupData, tour: Tour): void {
    popup.innerHTML = '';
    popup.className = `${tour.config.class ?? ''} ${tour.config.classPrefix} ${tour.config.animationClass}`;

    if (!tour.config.arrow.disable && tour.activeStep?.hasHost) {
        const arrow: HTMLDivElement = createElement('div', [
            tour.config.arrow.class ?? '',
            `${tour.config.classPrefix}-arrow`,
        ]);
        popup.appendChild(arrow);
    }

    if (popupData.customization?.class) {
        popup.classList.add(popupData.customization.class);
    }

    const header: HTMLDivElement = createElement('div', [
        `${tour.config.classPrefix}-header`,
        `${popupData.customization?.headerClass ?? ''}`,
    ]);
    popup.appendChild(header);

    const title: HTMLHeadElement = createElement('h1', [
        `${tour.config.classPrefix}-title`,
        `${popupData.customization?.titleClass ?? ''}`,
    ]);
    title.innerHTML = tour.config.translateFn(popupData.title ?? '');
    header.appendChild(title);

    if (tour.config.allowClose) {
        const closeButton: HTMLButtonElement = createElement('button', [
            `${tour.config.classPrefix}-close`,
            `${popupData.customization?.closeButtonClass ?? ''}`,
        ]);
        resolveCloseIcon(closeButton, tour.config.closeIcon);
        closeButton.onclick = tour.complete.bind(tour);
        header.appendChild(closeButton);
    }

    const content: HTMLDivElement = createElement('div', [
        `${tour.config.classPrefix}-content`,
        `${popupData.customization?.contentClass ?? ''}`,
    ]);
    popup.appendChild(content);

    const buttonList: HTMLDivElement = createElement('div', [
        `${tour.config.classPrefix}-footer`,
        `${popupData.customization?.footerClass ?? ''}`,
    ]);

    if (isNullOrUndefined(popupData.buttonList)) {
        popupData.buttonList = getDefaultButtonList(tour);
    }

    popupData.buttonList.forEach((button: TourButtonConfig) => {
        const buttonClassList: string[] = [`${tour.config.classPrefix}-button`, button.class ?? ''];
        if (isNullOrUndefined(button.type) || button.type === 'secondary') {
            buttonClassList.push(`${tour.config.classPrefix}-button-secondary`);
        } else if (button.type === 'primary') {
            buttonClassList.push(`${tour.config.classPrefix}-button-primary`);
        } else if (button.type === 'link') {
            buttonClassList.push(`${tour.config.classPrefix}-button-link`);
        }

        if (!isNullOrUndefined(button.class) && button.class !== '') {
            buttonClassList.push(button.class);
        }

        const buttonElement: HTMLButtonElement = createElement('button', buttonClassList);
        buttonElement.innerText = tour.config.translateFn(button.text);

        buttonElement.onclick = (e: MouseEvent): void => {
            button.action.call(tour);
        };

        buttonList.appendChild(buttonElement);
    });

    popup.appendChild(buttonList);
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

/**
 * Returns the default button list for the tour.
 * @param {Tour} tour - The tour instance.
 * @returns {TourButtonConfig[]} The default button configurations.
 */
function getDefaultButtonList(tour: Tour): TourButtonConfig[] {
    return [
        {
            text: 'Back',
            action: tour.prev,
        },
        {
            text: 'Next',
            type: 'primary',
            action: tour.next,
        },
    ];
}
