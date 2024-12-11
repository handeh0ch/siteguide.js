import { autoPlacement, computePosition, Middleware, offset, Placement } from '@floating-ui/dom';
import { TourStep } from '../tour-step';
import { PopupType } from '../types/popup.type';
import { delay, isDefined, isNullOrUndefined } from '../utils/base.util';
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

    /** @inheritdoc */
    public render(popup: HTMLElement, step: TourStep): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this._renderContentStrategy.has(step.popupData.type)) {
                throw new Error('Missing popup creator strategy');
            }

            popup.style.animation = 'none';
            popup.style.opacity = '0';
            if (step.hostElement) {
                popup.style.position = getPositionType(step.hostElement);
            } else {
                popup.style.position = 'fixed';
            }

            updatePopupLayout(popup, step.popupData, step.tour);
            this._renderContentStrategy
                .get(step.popupData.type)
                ?.renderContent(popup, step.popupData, step.tour.config);
            step.hostElement?.scrollIntoView(step.tour.config.scrollTo);
            resolve();
        })
            .then(() => {
                if (
                    step.isFirst ||
                    (!step.hasHost && !step.prevStep?.hasHost) ||
                    (!step.hasHost && !step.nextStep?.hasHost)
                ) {
                    return Promise.resolve();
                }

                return delay(400);
            })
            .then(() => {
                this.updatePosition(popup, step);
                popup.style.opacity = '1';
                popup.style.animation = 'fadeIn 0.3s ease-out';
            });
    }

    /** @inheritdoc */
    public updatePosition(popup: HTMLElement, step: TourStep): void {
        const scrollTop: number =
            popup.style.position === 'fixed' ? window.scrollY || document.documentElement.scrollTop : 0;

        const middleware: Middleware[] = [];
        const placement: Placement | undefined =
            isDefined(step.popupData.position) && step.popupData.position !== 'auto'
                ? (step.popupData.position as Placement)
                : undefined;

        if (step.popupData.position === 'auto' || isNullOrUndefined(placement)) {
            middleware.push(autoPlacement());
        }

        if (step.hostElement) {
            computePosition(step.hostElement, popup, {
                middleware: [...middleware, offset(20)],
            }).then(({ x, y }) => {
                Object.assign(popup.style, {
                    top: `${y - scrollTop}px`,
                    left: `${x}px`,
                    transform: '',
                });
            });
        } else {
            Object.assign(popup.style, {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            });
        }
    }

    private setUpStrategies(): void {
        this._renderContentStrategy.set('text', new TextStepRenderer());
        this._renderContentStrategy.set('custom', new CustomStepRenderer());
    }
}
