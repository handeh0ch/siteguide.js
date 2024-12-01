import { Tour } from '../../tour';
import type { PopupData } from '../../types/popup.type';

/**
 * Interface for updating popup view
 */
export interface IUpdatePopup {
    /**
     * Updates the popup view with the provided data
     * @param {HTMLElement} popup - The popup element to update
     * @param {PopupData} popupData - The data to use for updating the popup
     * @param {Tour} tour - The tour instance
     */
    updatePopupView(popup: HTMLElement, popupData: PopupData, tour: Tour): void;
}
