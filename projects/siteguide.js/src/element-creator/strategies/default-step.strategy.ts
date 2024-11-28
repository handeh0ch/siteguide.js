import { DefaultPopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';
import { IUpdatePopup } from '../interfaces/update-popup.interface';
import { updatePopupLayout } from '../utils/update-popup-layout.util';

export class DefaultStepStrategy implements IUpdatePopup {
    public updatePopupView(popupElement: HTMLElement, popupData: DefaultPopupData): void {
        updatePopupLayout(popupElement, popupData);

        const content: HTMLDivElement = popupElement.querySelector('.overview-content')!;

        this.appendContent(content, 'h2', popupData.title, ['overview-title']);
        this.appendContent(content, 'p', popupData.text, ['overview-description']);
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
