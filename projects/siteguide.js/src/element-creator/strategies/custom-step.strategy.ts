import type { CustomPopupData } from '../../types/popup.type';
import { IUpdatePopup } from '../interfaces/update-popup.interface';
import { updatePopupLayout } from '../utils/update-popup-layout.util';

export class CustomStepStrategy implements IUpdatePopup {
    public updatePopupView(popupElement: HTMLElement, popupData: CustomPopupData): void {
        updatePopupLayout(popupElement, popupData);

        const content: HTMLDivElement = popupElement.querySelector('.overview-content')!;

        content.appendChild(popupData.node);
    }
}
