import type { ITourStep } from 'interfaces/tour.interface';
import { ITour } from 'interfaces/tour.interface';
import { Dispatcher } from './events/dispatcher';
import { FloatingUiPopupRenderer } from './popup-renderer/floating-ui-popup.renderer';
import { HelperLayoutRenderer } from './popup-renderer/helper-layout.renderer';
import type { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { TourStep } from './tour-step';
import type { RequiredTourConfig, TourConfig } from './types/tour-config.type';
import type { StepId, TourStepConfig } from './types/tour-step-config.type';
import { isDefined } from './utils/base.util';
import { createElement } from './utils/create-element.util';
import { getCloseIconHTML } from './utils/get-close-icon.util';

export class Tour extends Dispatcher implements ITour {
    public get stepList(): readonly ITourStep[] {
        return this._stepList as Readonly<ITourStep[]>;
    }

    public get config(): RequiredTourConfig {
        return this._config;
    }

    public get popup(): HTMLElement | null {
        return this._popup;
    }

    public get helperLayout(): HTMLElement | null {
        return this._helperLayout;
    }

    public readonly popupRenderer: IRenderer = new FloatingUiPopupRenderer();
    public readonly helperRenderer: IRenderer = new HelperLayoutRenderer();

    /**
     * TODO remove
     * @deprecated remove later
     */
    public isStarted: boolean = false;

    private _popup: HTMLElement | null = null;
    private _helperLayout: HTMLElement | null = null;

    private _stepList: ITourStep[] = [];
    private _activeStep: ITourStep | null = null;
    private _bodyResizeObserver: ResizeObserver;
    private readonly _config: RequiredTourConfig;
    private readonly _stepMap: Map<StepId, TourStep> = new Map();

    public constructor(config: TourConfig) {
        super();
        this._bodyResizeObserver = this.getBodyResizeObserver();

        this._config = {
            classPrefix: config.classPrefix ?? 'siteguide',
            allowClose: config.allowClose ?? true,
            scrollTo: config.scrollTo ?? {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            },
            closeIcon: config.closeIcon ?? getCloseIconHTML(config.classPrefix ?? 'siteguide'),
            helperLayout: {
                paddingX: config.helperLayout?.paddingX ?? 8,
                paddingY: config.helperLayout?.paddingY ?? 8,
            },
        };
    }

    public addStep(config: TourStepConfig): void {
        if (this._stepMap.has(config.id)) {
            throw new Error('Step with provided id has been already registered');
        }

        const step: TourStep = new TourStep(this, config);

        this._stepList.push(step);
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
        this.isStarted = true;

        this._popup = createElement('div', [this._config.classPrefix]);
        document.body.appendChild(this._popup);

        this._helperLayout = createElement('div', [`${this._config.classPrefix}-helper`]);
        document.body.appendChild(this._helperLayout);

        this.dispatch('start');
        this.next();
    }

    public complete(): void {
        this.isStarted = false;

        if (this._popup) {
            document.body.removeChild(this._popup);
        }

        if (this._helperLayout) {
            document.body.removeChild(this._helperLayout);
        }

        this._activeStep = null;
        this.dispatch('complete');
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
        this._activeStep.show();

        this.dispatch('prev');
        this.dispatch('changeStep');
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
        this._activeStep.show();

        this.dispatch('next');
        this.dispatch('changeStep');
    }

    private getBodyResizeObserver(): ResizeObserver {
        const observer: ResizeObserver = new ResizeObserver(() => {
            if (!this.isStarted || !this._activeStep) {
                return;
            }

            if (isDefined(this._popup)) {
                this.popupRenderer.updatePosition(this._popup, this._activeStep);
            }

            if (isDefined(this._helperLayout)) {
                this.helperRenderer.updatePosition(this._helperLayout, this._activeStep);
            }
        });

        observer.observe(document.body);

        return observer;
    }
}
