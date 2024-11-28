import type { PopupData } from '../../types/popup.type';

export interface IUpdatePopup {
    updatePopupView(popupElement: HTMLElement, popupData: PopupData): void;
}
