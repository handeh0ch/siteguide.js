import { Tour } from '../../tour';
import type { TourButtonConfig } from '../../types/button-config.type';
import type { PopupData } from '../../types/popup.type';
import { isDefined, isNullOrUndefined } from '../../utils/base.util';
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
    popup.className = `${tour.config.class ?? ''} siteguide-pos ${tour.config.classPrefix} ${tour.config.animationClass}`;

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

    if (tour.config.close.button) {
        tour.config.closeIcon.onclick = tour.complete.bind(tour);
        header.appendChild(tour.config.closeIcon as HTMLElement);
    }

    const content: HTMLDivElement = createElement('div', [
        `${tour.config.classPrefix}-content`,
        `${popupData.customization?.contentClass ?? ''}`,
    ]);
    popup.appendChild(content);

    const footer: HTMLDivElement = createElement('div', [
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
        buttonElement.innerHTML = tour.config.translateFn(button.text);

        buttonElement.onclick = (e: MouseEvent): void => {
            button.action.call(tour);
        };

        footer.appendChild(buttonElement);
    });

    if (!tour.config.progress.disable && tour.config.progress.text) {
        if (isDefined(tour.activeStepIndex)) {
            const progressElement: HTMLParagraphElement = createElement('p', [
                `${tour.config.classPrefix}-progress`,
                `${popupData.customization?.progressClass ?? ''}`,
            ]);

            progressElement.innerHTML = tour.config.translateFn(
                formatProgress(tour.config.progress.text, tour.activeStepIndex + 1, tour.stepList.length)
            );

            footer.appendChild(progressElement);
        }
    }

    popup.appendChild(footer);
}

/**
 * Returns the default button list for the tour.
 * @param {Tour} tour - The tour instance.
 * @returns {TourButtonConfig[]} The default button configurations.
 */
function getDefaultButtonList(tour: Tour): TourButtonConfig[] {
    return [
        {
            text: tour.config.buttons.prevText,
            action: tour.prev,
        },
        {
            text: tour.config.buttons.nextText,
            type: 'primary',
            action: tour.next,
        },
    ];
}

/**
 * Process prgress temaplte string and insert numeric data on places
 * @param template - string where to insert indexes
 * @param currentStepIndex - currentStepIndex
 * @param totalStepsAmount - total steps amount
 * @returns modified string with pasted data
 */
function formatProgress(template: string, currentStepIndex: number, totalStepsAmount: number): string {
    return template
        .replace('{{currentStep}}', currentStepIndex.toString())
        .replace('{{totalSteps}}', totalStepsAmount.toString());
}
