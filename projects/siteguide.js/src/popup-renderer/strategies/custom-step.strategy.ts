import { Tour } from '../../tour';
import type { CustomPopupData } from '../../types/popup.type';
import { IUpdatePopup } from '../interfaces/update-popup.interface';
import { updatePopupLayout } from '../utils/update-popup-layout.util';

/**
 * CustomStepStrategy class implements IUpdatePopup interface to handle custom popup content
 */
export class CustomStepStrategy implements IUpdatePopup {
    /**
     * @inheritdoc
     */
    public updatePopupView(popup: HTMLElement, popupData: CustomPopupData, tour: Tour): void {
        updatePopupLayout(popup, popupData, tour);

        const content: HTMLDivElement = popup.querySelector(`.${tour.config.classPrefix}-content`)!;

        content.appendChild(popupData.node);
    }
}
