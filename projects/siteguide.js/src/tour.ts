import type { ITourStep } from 'interfaces/tour.interface';
import { ITour } from 'interfaces/tour.interface';
import { FloatingUiPopupRenderer } from './popup-renderer/floating-ui-popup.renderer';
import { HighlightRenderer } from './popup-renderer/highlight.renderer';
import type { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { TourStep } from './tour-step';
import type { RequiredTourConfig, TourConfig } from './types/tour-config.type';
import type { StepId, TourStepConfig } from './types/tour-step-config.type';
import { isDefined } from './utils/base.util';
import { createElement } from './utils/create-element.util';
import { getCloseIconHTML } from './utils/get-close-icon.util';

export class Tour implements ITour {
    public get stepList(): readonly ITourStep[] {
        return this._stepList as Readonly<ITourStep[]>;
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

    public readonly popupRenderer: IRenderer = new FloatingUiPopupRenderer();
    public readonly highlightRenderer: IRenderer = new HighlightRenderer();

    private _popup: HTMLElement | null = null;
    private _highlight: HTMLElement | null = null;

    private _stepList: ITourStep[] = [];
    private _activeStep: ITourStep | null = null;
    private _bodyResizeObserver: ResizeObserver;
    private _config: RequiredTourConfig;
    private readonly _stepMap: Map<StepId, TourStep> = new Map();

    public constructor(config: TourConfig) {
        this._bodyResizeObserver = this.getBodyResizeObserver();

        this._config = {
            classPrefix: config.classPrefix ?? 'siteguide',
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
            enableArrow: config.enableArrow ?? true,
            highlight: {
                disable: config.highlight?.disable ?? false,
                padding: config.highlight?.padding ?? 8,
                class: config.highlight?.class ?? 'siteguide-highlight',
            },
            translateFn: config.translateFn ?? ((token: string) => token),
        };
    }

    public addStep(config: TourStepConfig): void {
        if (this._stepMap.has(config.id)) {
            throw new Error('Step with provided id has been already registered');
        }

        const step: TourStep = new TourStep(this, config);

        if (isDefined(config.index)) {
            this._stepList.splice(config.index, 0, step);
        } else {
            this._stepList.push(step);
        }

        this._stepMap.set(config.id, step);
    }

    public addSteps(steps: TourStepConfig[]): void {
        steps.forEach((step: TourStepConfig) => this.addStep(step));
    }

    public removeStep(stepId: StepId): void {
        this._stepList = this._stepList.filter((step: ITourStep) => stepId !== step.id);

        this._stepMap.delete(stepId);
    }

    public start(): void {
        this._popup = createElement('div', [this._config.classPrefix]);
        document.body.appendChild(this._popup);

        if (!this._config.highlight.disable) {
            this._highlight = createElement('div', [
                isDefined(this._config.highlight.class)
                    ? this._config.highlight.class
                    : `${this._config.classPrefix}-highlight`,
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
        // @ts-expect-error
        this._config = {
            ...this._config,
            ...config,
        };
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
