/**
 * Type of a button
 */
export type TourButtonType = 'primary' | 'secondary';

/**
 * Represents the configuration for a button
 */
export type TourButtonConfig = {
    text: string;
    type?: TourButtonType;
    /**
     * Additional CSS class to apply to the button
     */
    class?: string;
    /**
     * The action to perform when the button is clicked.
     * This can be a function that returns void or a Promise that resolves to void
     */
    action: (() => void) | (() => Promise<void>);
};
