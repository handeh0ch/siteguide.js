import type { TourButtonConfig } from './button-config.type';

/**
 * Represents the data for a popup
 */
export type PopupData = TextPopupData | CustomPopupData;

/**
 * The type of a popup
 */
export type PopupType = 'text' | 'custom';

/**
 * The position of a popup
 */
export type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Represents the shared data for a popup, including title, position, customization, and button collection.
 */
export type SharedPopupData = {
    /**
     * The title of the popup
     */
    title?: string;
    /**
     * The position of the popup
     */
    position?: PopupPosition;
    /**
     * Customization options for the popup
     *
     * Each step-popup can have own styles by providing it's own classes
     */
    customization?: PopupCustomization;
    /**
     * A collection of button configurations for the popup
     */
    buttonList?: TourButtonConfig[];
};

/**
 * Represents the customization options for a popup
 */
export type PopupCustomization = {
    /**
     * The CSS class to apply to the popup container
     */
    class?: string;
    /**
     * The CSS class to apply to the popup header
     */
    headerClass?: string;
    /**
     * The CSS class to apply to the popup title
     */
    titleClass?: string;
    /**
     * The CSS class to apply to the popup close button
     */
    closeButtonClass?: string;
    /**
     * The CSS class to apply to the popup content
     */
    contentClass?: string;
    /**
     * The CSS class to apply to the popup description
     */
    descriptionClass?: string;
    /**
     * The CSS class to apply to the popup footer
     */
    footerClass?: string;
};
/**
 * Represents the data for a text popup
 */
export type TextPopupData = SharedPopupData & {
    type: Extract<PopupType, 'text'>;
    /**
     * The text to display in the popup
     */
    text: string;
};

/**
 * Represents the data for a custom popup
 */
export type CustomPopupData = SharedPopupData & {
    type: Extract<PopupType, 'custom'>;
    /**
     * The HTML element to use as the content of the custom popup
     */
    node: HTMLElement;
};
