import { autoPlacement, computePosition, offset } from '@floating-ui/dom';
import { TourStep } from '../tour-step';
import { PopupType } from '../types/popup.type';
import { getPositionType } from '../utils/is-fixed.util';
import { IPopupContentRenderer } from './interfaces/popup-content-renderer.interface';
import { IRenderer } from './interfaces/renderer.interface';
import { CustomStepRenderer } from './strategies/custom-step.renderer';
import { TextStepRenderer } from './strategies/text-step.renderer';
import { updatePopupLayout } from './utils/update-popup-layout.util';

export class FloatingUiPopupRenderer implements IRenderer {
    private readonly _renderContentStrategy: Map<PopupType, IPopupContentRenderer> = new Map();

    constructor() {
        this.setUpStrategies();
    }

    public render(popup: HTMLElement, step: TourStep): void {
        if (!this._renderContentStrategy.has(step.popupData.type)) {
            throw new Error('Missing popup creator strategy');
        }

        popup.style.position = getPositionType(step.hostElement!);
        updatePopupLayout(popup, step.popupData, step.tour.config, step.tour.complete.bind(step.tour));
        this._renderContentStrategy.get(step.popupData.type)?.renderContent(popup, step.popupData, step.tour.config);

        this.updatePosition(popup, step);
        step.hostElement?.scrollIntoView(step.tour.config.scrollTo);
    }

    public updatePosition(popup: HTMLElement, step: TourStep): void {
        computePosition(step.hostElement!, popup, {
            middleware: [
                autoPlacement({
                    allowedPlacements: ['left', 'top', 'right', 'bottom'],
                }),
                offset(20),
            ],
        }).then(({ x, y }) => {
            Object.assign(popup.style, {
                top: `${y}px`,
                left: `${x}px`,
            });
        });
    }

    private setUpStrategies(): void {
        this._renderContentStrategy.set('text', new TextStepRenderer());
        this._renderContentStrategy.set('custom', new CustomStepRenderer());
    }
}
