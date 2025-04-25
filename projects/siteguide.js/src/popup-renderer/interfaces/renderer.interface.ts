import { TourStep } from '../../tour-step';

/**
 * Interface for rendering element
 */
export interface IRenderer {
    /**
     * Renders the popup for a given step
     * @param {HTMLElement} popup - The popup element to render content into
     * @param {TourStep} step - The tour step for which to render the popup content
     */
    render(popup: HTMLElement, step: TourStep): Promise<void>;

    /**
     * Updates the position of the popup based on the step's host element
     * @param {HTMLElement} popup - The popup element to update the position for
     * @param {TourStep} step - The tour step that the popup is associated with
     */
    updatePosition(popup: HTMLElement, step: TourStep): void;
}
