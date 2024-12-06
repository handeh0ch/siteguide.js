import { CustomPopupData } from '../../types/popup.type';
import { RequiredTourConfig } from '../../types/tour-config.type';
import { IPopupContentRenderer } from '../interfaces/popup-content-renderer.interface';

/**
 * CustomStepStrategy class implements IUpdatePopup interface to handle custom popup content
 */
export class CustomStepRenderer implements IPopupContentRenderer {
    /**
     * @inheritdoc
     */
    public renderContent(popup: HTMLElement, popupData: CustomPopupData, tourConfig: RequiredTourConfig): void {
        const content: HTMLDivElement = popup.querySelector(`.${tourConfig.classPrefix}-content`)!;
        content.appendChild(popupData.node);
    }
}
