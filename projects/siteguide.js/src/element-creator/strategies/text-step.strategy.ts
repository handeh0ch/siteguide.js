import { Tour } from 'tour';
import { TextPopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';
import { IUpdatePopup } from '../interfaces/update-popup.interface';
import { updatePopupLayout } from '../utils/update-popup-layout.util';

export class TextStepStrategy implements IUpdatePopup {
    public updatePopupView(popup: HTMLElement, popupData: TextPopupData, tour: Tour): void {
        updatePopupLayout(popup, popupData, tour);

        const content: HTMLDivElement = popup.querySelector(`.${tour.config.classPrefix}-content`)!;
        this.appendContent(content, 'p', popupData.text, [`${tour.config.classPrefix}-description`]);
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
