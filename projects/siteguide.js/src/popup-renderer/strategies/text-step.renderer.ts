import { RequiredTourConfig } from 'types/tour-config.type';
import { TextPopupData } from '../../types/popup.type';
import { createElement } from '../../utils/create-element.util';
import { IPopupContentRenderer } from '../interfaces/popup-content-renderer.interface';

/**
 * TextStepStrategy class implements IUpdatePopup interface to handle custom popup content
 */
export class TextStepRenderer implements IPopupContentRenderer {
    /** @inheritdoc */
    public renderContent(popup: HTMLElement, popupData: TextPopupData, tourConfig: RequiredTourConfig): void {
        const content: HTMLDivElement = popup.querySelector(`.${tourConfig.classPrefix}-content`)!;

        if (popupData.imgSrc) {
            const img: HTMLImageElement = createElement('img', [
                `${tourConfig.classPrefix}-image`,
                `${popupData.customization?.imageClass ?? ''}`,
            ]);
            img.src = popupData.imgSrc;
            content.appendChild(img);
        }

        if (popupData.text) {
            const description: HTMLParagraphElement = createElement('p', [
                `${tourConfig.classPrefix}-description`,
                `${popupData.customization?.descriptionClass ?? ''}`,
            ]);
            description.innerText = tourConfig.translateFn(popupData.text);
            content.appendChild(description);
        }
    }
}
