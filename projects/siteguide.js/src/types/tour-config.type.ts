import type { DeepRequired } from './utility.type';

export type PopupCloseIconElement = HTMLElement;

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
     * Add the way to allow close
     */
    close?: {
        /**
         * Indicates if the tour popup can be closed by click header button
         * @default true
         */
        button?: boolean;
        /**
         * Indicates if the tour popup can be closed by click outside a popup
         * @default false
         */
        clickout?: boolean;
        /**
         * Indicates if the tour popup can be closed by click escape key
         * @default true
         */
        esc?: boolean;
    };
    /**
     * Specifies if the tour should scroll to the current step and how to scroll
     * Can be a boolean to enable or disable scrolling, or an object with options for scrollIntoView
     * @default {behavior:'smooth',block:'center',inline:'center'}
     */
    scrollTo?: boolean | ScrollIntoViewOptions;
    /**
     * The element or HTML to use as the close icon
     */
    closeIcon?: HTMLElement;
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
     * Configuration for the highlight
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
    /**
     * Configuration for the progress
     */
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
     * Configuration for the intersection
     */
    intersection: {
        /**
         * Disabling interaction with host element
         * @default false
         */
        disable?: boolean;
    };
    /**
     * Control tour from keyboard arrows
     * @default false
     */
    keyboardControl?: boolean;
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
