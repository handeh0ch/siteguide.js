import { FloatingUiPopupRenderer } from './popup-renderer/floating-ui-popup.renderer';
import { HighlightRenderer } from './popup-renderer/highlight.renderer';
import type { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { TourStep } from './tour-step';
import type { StepDirection } from './types/step-direction.type';
import type { RequiredTourConfig, TourConfig } from './types/tour-config.type';
import type { TourStepConfig } from './types/tour-step-config.type';
import { isDefined, isNullOrUndefined } from './utils/base.util';
import { createElement } from './utils/create-element.util';
import { deepMerge } from './utils/deep-merge.util';
import { getDefaultCloseButton } from './utils/get-default-close-button.util';

class SiteguideData {
    public get isActive(): boolean {
        return isDefined(this.activeTour);
    }

    public get activeTour(): Tour | null {
        return this._activeTour;
    }

    private _activeTour: Tour | null = null;

    public setActiveTour(tour: Tour | null): void {
        this._activeTour = tour;
    }
}

export const SiteguideBase = new SiteguideData();

export class Tour {
    public get stepList(): readonly TourStep[] {
        return this._stepList as Readonly<TourStep[]>;
    }

    public get config(): RequiredTourConfig {
        return this._config;
    }

    public get popup(): HTMLElement | null {
        return this._popup;
    }

    public get highlight(): HTMLElement | null {
        return this._highlight;
    }

    public get intersection(): HTMLElement | null {
        return this._intersection;
    }

    public get activeStep(): TourStep | null {
        return this._activeStep;
    }

    public get activeStepIndex(): number | null {
        if (!this._activeStep) {
            return null;
        }

        return this.stepList.indexOf(this._activeStep);
    }

    public readonly popupRenderer: IRenderer = new FloatingUiPopupRenderer();
    public readonly highlightRenderer: IRenderer = new HighlightRenderer();
    public readonly intersectionRenderer: IRenderer = new HighlightRenderer();

    private _popup: HTMLElement | null = null;
    private _highlight: HTMLElement | null = null;
    private _intersection: HTMLElement | null = null;

    private _stepList: TourStep[] = [];
    private _activeStep: TourStep | null = null;
    private _bodyResizeObserver: ResizeObserver;
    private _config: RequiredTourConfig;

    public constructor(config: TourConfig) {
        this._bodyResizeObserver = this.getBodyResizeObserver();

        this._config = {
            classPrefix: config.classPrefix ?? 'siteguide',
            class: '',
            animationClass: config.animationClass ?? 'siteguide-animation',
            close: {
                button: config.close?.button ?? true,
                clickout: config.close?.clickout ?? false,
                esc: config.close?.esc ?? true,
            },
            // @ts-expect-error
            scrollTo: config.scrollTo ?? {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            },
            // @ts-expect-error
            closeIcon: config.closeIcon ?? getDefaultCloseButton(config.classPrefix ?? 'siteguide'),
            arrow: {
                disable: config.arrow?.disable ?? false,
                class: config.arrow?.class ?? '',
            },
            highlight: {
                disable: config.highlight?.disable ?? false,
                padding: config.highlight?.padding ?? 8,
                class: config.highlight?.class ?? '',
            },
            progress: {
                disable: config.progress?.disable ?? true,
                text: `Step {{currentStep}} of {{totalSteps}}`,
            },
            intersection: {
                disable: config.intersection.disable ?? false,
            },
            keyboardControl: config.keyboardControl ?? false,
            translateFn: config.translateFn ?? ((token: string) => token),
        };
    }

    public addStep(config: TourStepConfig): void {
        if (isNullOrUndefined(config.index)) {
            const maxIndex = this._stepList.reduce((max, step) => {
                return step.index !== null && step.index !== undefined && step.index > max ? step.index : max;
            }, -1);

            config.index = maxIndex + 1;
        }

        const step: TourStep = new TourStep(this, config);

        this._stepList.push(step);
        this._stepList.sort((a, b) => a.index! - b.index!);
    }

    public addSteps(steps: TourStepConfig[]): void {
        steps.forEach((step: TourStepConfig) => this.addStep(step));
    }

    public removeStep(index: number): void {
        this._stepList = this._stepList.filter((step: TourStep) => index !== step.index);
    }

    public start(): void {
        if (SiteguideBase.isActive) {
            return;
        }

        if (this.config.close.esc) {
            document.addEventListener('keydown', this.closeOnEsc);
        }

        if (this.config.keyboardControl) {
            document.addEventListener('keydown', this.keyboardControl);
        }

        SiteguideBase.setActiveTour(this);
        this._popup = createElement('div', [this._config.classPrefix]);
        document.body.appendChild(this._popup);

        if (!this._config.highlight.disable) {
            this._highlight = createElement('div', [
                this._config.highlight.class,
                `${this._config.classPrefix}-highlight`,
            ]);
            document.body.appendChild(this._highlight);
        }

        if (this._config.intersection.disable) {
            this._intersection = createElement('div', ['siteguide-intersection']);
            document.body.appendChild(this._intersection);
        }

        // this.dispatch('start');
        this.next();
    }

    public complete(): void {
        if (this._popup) {
            document.body.removeChild(this._popup);
        }

        if (this._highlight) {
            document.body.removeChild(this._highlight);
        }

        this._activeStep?.hide();
        this._activeStep = null;

        // this.dispatch('complete');
        SiteguideBase.setActiveTour(null);

        if (this.config.close.esc) {
            document.removeEventListener('keydown', this.closeOnEsc);
        }

        if (this.config.keyboardControl) {
            document.removeEventListener('keydown', this.keyboardControl);
        }
    }

    public prev(): void {
        const stepIndex: number = isDefined(this._activeStep)
            ? this._stepList.indexOf(this._activeStep) - 1
            : this._stepList.indexOf(this._stepList[this._stepList.length - 1]);

        if (stepIndex < 0) {
            this.complete();
            return;
        }

        this.changeStepTo(stepIndex, 'fromBack');

        // this.dispatch('prev');
        // this.dispatch('changeStep');
    }

    public async next(): Promise<void> {
        // this.dispatch('afterChangeStep');
        const stepIndex: number = isDefined(this._activeStep)
            ? this._stepList.indexOf(this._activeStep) + 1
            : this._stepList.indexOf(this._stepList[0]);

        if (stepIndex >= this._stepList.length) {
            this.complete();
            return;
        }

        if (isDefined(this._activeStep?.popupData.allowNext)) {
            const allowNext: boolean = (await this._activeStep?.popupData.allowNext.call(this)) ?? true;

            if (!allowNext) {
                return;
            }
        }

        this.changeStepTo(stepIndex, 'toNext');

        // this.dispatch('next');
    }

    public goTo(index: number): void {
        if (index > this._stepList.length - 1) {
            console.error('Provided index was larger than steps amount');
            return;
        }

        this.changeStepTo(index, index > (this.activeStepIndex ?? -1) ? 'toNext' : 'fromBack');
    }

    public setConfig(config: TourConfig): void {
        this._config = deepMerge(this._config, config as RequiredTourConfig);
    }

    private changeStepTo(index: number, direction: StepDirection): void {
        this._activeStep?.hide();
        this._activeStep = this._stepList[index];
        this._activeStep.show(direction);
    }

    private getBodyResizeObserver(): ResizeObserver {
        const observer: ResizeObserver = new ResizeObserver(() => {
            if (!this._activeStep) {
                return;
            }

            if (isDefined(this._popup)) {
                this.popupRenderer.updatePosition(this._popup, this._activeStep);
            }

            if (isDefined(this._highlight) && !this.config.highlight.disable) {
                this.highlightRenderer.updatePosition(this._highlight, this._activeStep);
            }
        });

        observer.observe(document.body);

        return observer;
    }

    private closeOnEsc = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.complete();
        }
    };

    private keyboardControl = (event: KeyboardEvent): void => {
        if (event.key === 'ArrowRight') {
            this.next();
        } else if (event.key === 'ArrowLeft') {
            this.prev();
        }
    };
}
