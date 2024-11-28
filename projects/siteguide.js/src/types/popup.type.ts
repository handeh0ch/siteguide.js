import type { ButtonConfig } from './button-config.type';

export type PopupData = DefaultPopupData | CustomPopupData;

export type PopupType = 'default' | 'custom';

export type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

export type SharedPopupData = {
    className?: string;
    position: PopupPosition;
    buttonCollection: ButtonConfig[];
};

export type DefaultPopupData = SharedPopupData & {
    type: Extract<PopupType, 'default'>;
    title: string;
    text: string;
    buttonCollection: ButtonConfig[];
};

export type CustomPopupData = SharedPopupData & {
    type: Extract<PopupType, 'custom'>;
    node: HTMLElement;
};
