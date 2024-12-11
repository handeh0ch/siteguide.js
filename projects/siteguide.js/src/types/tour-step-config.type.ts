import type { PopupData } from './popup.type';

/**
 * Represents the host of a tour step. It can be a string, an HTMLElement, or a function that returns either an HTMLElement or a string.
 * @example
 * // Example 1: Class as host
 * { host: '.example-element' }
 * @example
 * // Example 2: HTMLElement as host
 * { host: document.querySelector('.example-element') }
 * @example
 * // Example 3: Function returning HTMLElement as host
 * { host: () => document.querySelector('.example-element') };
 * @example
 * // Example 4: Function returning string as host
 * { host: () => '.example-element' };
 */
export type PopupHost = string | HTMLElement | (() => HTMLElement | string);

export type StepId = string;

/**
 * Represents the configuration for a single step in a tour
 */
export type TourStepConfig = {
    /**
     * The unique identifier for the tour step.
     */
    id: StepId;
    /**
     * The host element or a function that returns the host element for the tour step
     */
    host?: PopupHost;
    /**
     * The popup data for the tour step
     */
    popup: PopupData;
};
