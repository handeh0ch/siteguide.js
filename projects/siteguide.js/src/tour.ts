import { FloatingUiPopupRenderer } from './popup-renderer/floating-ui-popup.renderer';
import { HelperLayoutRenderer } from './popup-renderer/helper-layout.renderer';
import { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { TourStep } from './tour-step';
import { TourButtonConfig } from './types/button-config.type';
import { RequiredTourConfig, TourConfig } from './types/tour-config.type';
import { StepId, TourStepConfig } from './types/tour-step-config.type';
import { isDefined } from './utils/base.util';
import { createElement } from './utils/create-element.util';
import { getCloseIconHTML } from './utils/get-close-icon.util';

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

    private _stepList: TourStep[] = [];
    private _currentStep: TourStep | null = null;
    private _bodyResizeObserver: ResizeObserver;
    private readonly _config: RequiredTourConfig;
    private readonly _stepMap: Map<StepId, TourStep> = new Map();

    public constructor(config: TourConfig) {
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
        };
    }

    public addStep(config: TourStepConfig): void {
        if (this._stepMap.has(config.id)) {
            throw new Error('Step with provided id has been already registered');
        }

        const step: TourStep = new TourStep(this, config);

        config.popup.buttonCollection.forEach((button: TourButtonConfig) => (button.action = button.action.bind(this)));
        this._stepList.push(step);
        this._stepMap.set(config.id, step);
    }

    public removeStep(stepId: StepId): void {
        this._stepList = this._stepList.filter((step: TourStep) => stepId !== step.id);

        this._stepMap.delete(stepId);
    }

    public start(): void {
        this.isStarted = true;

        this._popup = createElement('div', [this._config.classPrefix]);
        document.body.appendChild(this._popup);

        this._helperLayout = createElement('div', [`${this._config.classPrefix}-helper`]);
        this._helperLayout.addEventListener('click', () => {
            this.complete();
        });
        document.body.appendChild(this._helperLayout);

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
    }

    public prev(): void {
        const stepIndex: number = this._stepList.indexOf(this._currentStep!) - 1;

        if (stepIndex < 0) {
            this.complete();
            return;
        }

        this._currentStep = this._stepList[stepIndex];
        this._currentStep.show();
    }

    public next(): void {
        const stepIndex: number = this._stepList.indexOf(this._currentStep!) + 1;

        if (stepIndex >= this._stepList.length) {
            this.complete();
            return;
        }

        this._currentStep = this._stepList[stepIndex];
        this._currentStep.show();
    }

    private getBodyResizeObserver(): ResizeObserver {
        const observer: ResizeObserver = new ResizeObserver(() => {
            if (!this.isStarted || !this._currentStep) {
                return;
            }

            if (isDefined(this._popup)) {
                this.popupRenderer.updatePosition(this._popup, this._currentStep);
            }

            if (isDefined(this._helperLayout)) {
                this.helperRenderer.updatePosition(this._helperLayout, this._currentStep);
            }
        });

        observer.observe(document.body);

        return observer;
    }
}
