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
     * Specifies if the tour should scroll to the current step and how to scroll
     * Can be a boolean to enable or disable scrolling, or an object with options for scrollIntoView
     * @default {behavior:'smooth',block:'center',inline:'center'}
     */
    scrollTo?: boolean | ScrollIntoViewOptions;
    /**
     * The element or HTML to use as the close icon
     */
    closeIcon?: PopupCloseIconElement;
};
