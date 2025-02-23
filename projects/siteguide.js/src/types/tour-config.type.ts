import type { DeepRequired } from './utility.type';

export type PopupCloseIconElement = InnerHTML | HTMLElement;

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
     * Indicates if the arrow should be shown
     * @default true
     */
    enableArrow?: boolean;
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
         * The class to apply to the highlight
         * @default 'siteguide-highlight'
         */
        class?: string;
    };

    /**
     * The class to apply to the tour popup animation
     * @default 'siteguide-animation'
     */
    animationClass?: string;
};

/**
 * Represents a required tour configuration.
 * This type ensures all properties of the TourConfig are required.
 */
export type RequiredTourConfig = DeepRequired<TourConfig>;
