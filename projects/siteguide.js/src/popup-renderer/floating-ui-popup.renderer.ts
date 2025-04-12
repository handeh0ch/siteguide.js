import {
    arrow,
    autoPlacement,
    computePosition,
    ComputePositionReturn,
    Middleware,
    offset,
    Placement,
} from '@floating-ui/dom';
import { TourStep } from '../tour-step';
import type { PopupType } from '../types/popup.type';
import { delay, isDefined, isNullOrUndefined } from '../utils/base.util';
import { getPositionType } from '../utils/is-fixed.util';
import type { IPopupContentRenderer } from './interfaces/popup-content-renderer.interface';
import type { IRenderer } from './interfaces/renderer.interface';
import { CustomStepRenderer } from './strategies/custom-step.renderer';
import { TextStepRenderer } from './strategies/text-step.renderer';
import { updatePopupLayout } from './utils/update-popup-layout.util';

type StaticSide = Extract<Placement, 'top' | 'right' | 'bottom' | 'left'>;

export class FloatingUiPopupRenderer implements IRenderer {
    private readonly _renderContentStrategy: Map<PopupType, IPopupContentRenderer> = new Map();

    private readonly _staticSides: Record<StaticSide, string> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    };

    constructor() {
        this.setUpStrategies();
    }

    /** @inheritdoc */
    public render(popup: HTMLElement, step: TourStep): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this._renderContentStrategy.has(step.popupData.type)) {
                throw new Error('Missing popup creator strategy');
            }

            popup.style.display = 'none';
            popup.classList.remove(step.tour.config.animationClass);
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
                if (step.isFirst && step.direction === 'toNext') {
                    return delay(0);
                }

                return delay(400);
            })
            .then(() => {
                popup.style.display = 'flex';
                this.updatePosition(popup, step);
                popup.classList.add(step.tour.config.animationClass);
            });
    }

    /** @inheritdoc */
    public updatePosition(popup: HTMLElement, step: TourStep): void {
        if (isDefined(step.hostElement)) {
            this.renderFloatingPopup(popup, step);
        } else {
            this.renderCenterPopup(popup);
        }
    }

    private renderFloatingPopup(popup: HTMLElement, step: TourStep): void {
        const scrollTop: number =
            popup.style.position === 'fixed' ? window.scrollY || document.documentElement.scrollTop : 0;

        const arrowEl: HTMLDivElement | null = popup.querySelector(`.${step.tour.config.classPrefix}-arrow`);

        const middlewares: Middleware[] = [];

        const primaryPlacement: Placement | undefined =
            isDefined(step.popupData.position) && step.popupData.position !== 'auto'
                ? (step.popupData.position as Placement)
                : undefined;

        const arrowLen: number = arrowEl?.offsetWidth ?? 10;
        const floatingOffset: number = Math.sqrt(2 * arrowLen ** 2) / 2 + step.tour.config.highlight.padding;

        middlewares.push(offset(floatingOffset));

        if (step.popupData.position === 'auto' || isNullOrUndefined(primaryPlacement)) {
            middlewares.push(autoPlacement());
        }

        if (!step.tour.config.arrow.disable && isDefined(arrowEl)) {
            middlewares.push(arrow({ element: arrowEl, padding: step.tour.config.arrow.padding }));
        }

        computePosition(step.hostElement!, popup, {
            placement: primaryPlacement,
            middleware: [...middlewares],
        }).then(({ x, y, middlewareData, placement }: ComputePositionReturn) => {
            Object.assign(popup.style, {
                top: `${y - scrollTop}px`,
                left: `${x}px`,
                marginTop: '0',
                marginLeft: '0',
            });

            const side: StaticSide = placement.split('-')[0] as StaticSide;

            const staticSide: string = this._staticSides[side];

            if (middlewareData.arrow && isDefined(arrowEl)) {
                const { x, y } = middlewareData.arrow;
                Object.assign(arrowEl.style, {
                    left: x != null ? `${x}px` : '',
                    top: y != null ? `${y}px` : '',
                    right: '',
                    bottom: '',
                    [staticSide]: `${-arrowLen / 2}px`,
                    transform: 'rotate(45deg)',
                });
            }
        });
    }

    private renderCenterPopup(popup: HTMLElement): void {
        Object.assign(popup.style, {
            top: '50%',
            left: '50%',
            marginTop: `-${popup.clientHeight / 2}px`,
            marginLeft: `-${popup.clientWidth / 2}px`,
        });
    }

    private setUpStrategies(): void {
        this._renderContentStrategy.set('text', new TextStepRenderer());
        this._renderContentStrategy.set('custom', new CustomStepRenderer());
    }
}
