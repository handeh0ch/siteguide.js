import { Tour } from '../../tour';
import type { PopupData } from '../../types/popup.type';

export interface IUpdatePopup {
    updatePopupView(popup: HTMLElement, popupData: PopupData, tour: Tour): void;
}
