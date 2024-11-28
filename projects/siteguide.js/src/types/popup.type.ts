import type { ButtonConfig } from './button-config.type';

export type PopupData = TextPopupData | CustomPopupData;

export type PopupType = 'text' | 'custom';

export type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

export type SharedPopupData = {
    title?: string;
    position: PopupPosition;
    buttonCollection: ButtonConfig[];
};

export type TextPopupData = SharedPopupData & {
    type: Extract<PopupType, 'text'>;
    text: string;
};

export type CustomPopupData = SharedPopupData & {
    type: Extract<PopupType, 'custom'>;
    node: HTMLElement;
};
