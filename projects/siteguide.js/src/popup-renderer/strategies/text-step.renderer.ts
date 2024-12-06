import { RequiredTourConfig } from 'types/tour-config.type';
import { TextPopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';
import { IPopupContentRenderer } from '../interfaces/popup-content-renderer.interface';

/**
 * TextStepStrategy class implements IUpdatePopup interface to handle custom popup content
 */
export class TextStepRenderer implements IPopupContentRenderer {
    /** @inheritdoc */
    public renderContent(popup: HTMLElement, popupData: TextPopupData, tourConfig: RequiredTourConfig): void {
        const content: HTMLDivElement = popup.querySelector(`.${tourConfig.classPrefix}-content`)!;
        this.appendContent(content, 'p', popupData.text, [
            `${tourConfig.classPrefix}-description`,
            `${popupData.customization?.descriptionClass ?? ''}`,
        ]);
    }

    /**
     * Appends a new HTML element with the specified class list and inner text to the parent element.
     * @param {HTMLElement} parent - The parent element to which the new element will be appended.
     * @param {keyof HTMLElementTagNameMap} tagType - The type of HTML element to create and append.
     * @param {string} innerText - The inner text to set for the new element.
     * @param {string[]} classList - An array of class names to add to the new element.
     * @returns {void}
     */
    private appendContent(
        parent: HTMLElement,
        tagType: keyof HTMLElementTagNameMap,
        innerText: string,
        classList: string[]
    ): void {
        const child: HTMLElement = createElement(tagType, classList);
        child.innerText = innerText;
        parent.appendChild(child);
    }
}
