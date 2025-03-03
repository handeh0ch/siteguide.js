import { FloatingUiPopupRenderer } from './popup-renderer/floating-ui-popup.renderer';
import { HighlightRenderer } from './popup-renderer/highlight.renderer';
import type { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { TourStep } from './tour-step';
import type { RequiredTourConfig, TourConfig } from './types/tour-config.type';
import type { TourStepConfig } from './types/tour-step-config.type';
import { isDefined, isNullOrUndefined } from './utils/base.util';
import { createElement } from './utils/create-element.util';
import { deepMerge } from './utils/deep-merge.util';
import { getCloseIconHTML } from './utils/get-close-icon.util';

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

    private _popup: HTMLElement | null = null;
    private _highlight: HTMLElement | null = null;

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
            allowClose: config.allowClose ?? true,
            // @ts-expect-error
            scrollTo: config.scrollTo ?? {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            },
            allowClickoutClose: config.allowClickoutClose ?? false,
            closeIcon: config.closeIcon ?? getCloseIconHTML(config.classPrefix ?? 'siteguide'),
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
        if (isDefined(SiteguideBase.activeTour)) {
            return;
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

        // if (this._config.allowClickoutClose) {
        //     document.body.addEventListener('click', this.complete.bind(this));
        // }

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

        this._activeStep = null;

        // this.dispatch('complete');
        SiteguideBase.setActiveTour(null);
    }

    public prev(): void {
        const stepIndex: number = isDefined(this._activeStep)
            ? this._stepList.indexOf(this._activeStep) - 1
            : this._stepList.indexOf(this._stepList[this._stepList.length - 1]);

        if (stepIndex < 0) {
            this.complete();
            return;
        }

        this._activeStep = this._stepList[stepIndex];
        this._activeStep.show('fromBack');

        // this.dispatch('prev');
        // this.dispatch('changeStep');
    }

    public next(): void {
        const stepIndex: number = isDefined(this._activeStep)
            ? this._stepList.indexOf(this._activeStep) + 1
            : this._stepList.indexOf(this._stepList[0]);

        if (stepIndex >= this._stepList.length) {
            this.complete();
            return;
        }

        this._activeStep = this._stepList[stepIndex];
        this._activeStep.show('toNext');

        // this.dispatch('next');
        // this.dispatch('changeStep');
    }

    public setConfig(config: TourConfig): void {
        this._config = deepMerge(this._config, config as RequiredTourConfig);
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
}
