import type { DeepRequired } from './utility.type';

export type PopupCloseIconElement = InnerHTML | HTMLElement;

/**
 * The function to translate the tokens
 * @param {string} token - The token to translate
 * @returns {string} The translated string
 */
export type TranslateFn = (token: string) => string;

/**
 * Represents the configuration for a tour.
 */
export type TourConfig = {
    /**
     * The prefix for the CSS classes used in the tour
     * Overriding this prefix will replace all 'siteguide-' prefixes with '{classPrefix}-'
     * This option allows to easily replace all classes for customizing popup html
     * @default 'siteguide'
     */
    classPrefix?: string;
    /**
     * Additional class to provide for popup
     * @default ''
     */
    class?: string;
    /**
     * Indicates if the tour popup can be closed by the user
     * @default true
     */
    allowClose?: boolean;
    /**
     * Indicates if the tour popup can be closed by clicking outside the popup
     * @default true
     */
    allowClickoutClose?: boolean;
    /**
     * Specifies if the tour should scroll to the current step and how to scroll
     * Can be a boolean to enable or disable scrolling, or an object with options for scrollIntoView
     * @default {behavior:'smooth',block:'center',inline:'center'}
     */
    scrollTo?: boolean | ScrollIntoViewOptions;
    /**
     * The element or HTML to use as the close icon
     */
    closeIcon?: PopupCloseIconElement;
    /**
     * Arrow configuration
     */
    arrow?: {
        /**
         * Indicates if the arrow should be shown
         * @default false
         */
        disable?: boolean;
        /**
         * Additional class to apply to the arrow
         * @default ''
         */
        class?: string;
    };
    /**
     * Configuration for the helper layout.
     */
    highlight?: {
        /**
         * Indicates if the helper layout should be disabled
         * @default false
         */
        disable?: boolean;
        /**
         * The horizontal padding for the helper layout.
         * @default 8
         */
        padding?: number;
        /**
         * Additional class to apply to the highlight
         * @default ''
         */
        class?: string;
    };
    progress?: {
        /**
         * Disable tour progress display
         * @default true
         */
        disable?: boolean;
        /**
         * Progress text to show
         * @default 'Step {{currentStep}} of {{totalSteps}}'
         */
        text?: string;
    };
    /**
     * The class to apply to the tour popup animation
     * @default 'siteguide-animation'
     */
    animationClass?: string;
    /**
     * The function to translate the tokens
     */
    translateFn?: TranslateFn;
};

/**
 * Represents a required tour configuration.
 * This type ensures all properties of the TourConfig are required.
 */
export type RequiredTourConfig = DeepRequired<TourConfig>;
