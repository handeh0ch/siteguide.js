import type { PopupData } from '../../types/popup.type';
import type { RequiredTourConfig } from '../../types/tour-config.type';

/**
 * Interface for rendering popup content
 */
export interface IPopupContentRenderer {
    /**
     * Renders the popup view with the provided data
     * @param {HTMLElement} popup - The popup element to update
     * @param {PopupData} popupData - The data to use for updating the popup
     * @param {RequiredTourConfig} tourConfig - The tour configuration
     */
    renderContent(popup: HTMLElement, popupData: PopupData, tourConfig: RequiredTourConfig): void;
}
