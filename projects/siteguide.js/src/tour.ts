import { IUpdatePopup } from './element-creator/interfaces/update-popup.interface';
import { CustomStepStrategy } from './element-creator/strategies/custom-step.strategy';
import { DefaultStepStrategy } from './element-creator/strategies/default-step.strategy';
import { TourStep } from './tour-step';
import { ButtonConfig } from './types/button-config.type';
import { PopupType } from './types/popup.type';
import { TourConfig } from './types/tour-config.type';
import { StepId, TourStepConfig } from './types/tour-step-config.type';
import { createElement } from './utils/create-element.util';

export class Tour {
    public get stepList(): TourStep[] {
        return [...this._stepList];
    }

    public get config(): TourConfig {
        return this._config;
    }

    public get popupElement(): HTMLElement | null {
        return this._popupElement;
    }

    public get helperElement(): HTMLElement | null {
        return this._helperElement;
    }

    /**
     * TODO remove
     * @deprecated remove later
     */
    public isStarted: boolean = false;

    public readonly updatePopupStrategies: Map<PopupType, IUpdatePopup> = new Map();

    private _popupElement: HTMLElement | null = null;
    private _helperElement: HTMLElement | null = null;

    private readonly _stepMap: Map<StepId, TourStep> = new Map();
    private _stepList: TourStep[] = [];
    private _currentStep: TourStep | null = null;
    private _bodyResizeObserver!: ResizeObserver;

    public constructor(private readonly _config: TourConfig) {
        this.setUpStrategies();
        this.setUpBodySizeObserver();
    }

    public addStep(config: TourStepConfig): void {
        if (this._stepMap.has(config.id)) {
            throw new Error('Step with provided id has been already registered');
        }

        const step: TourStep = new TourStep(this, config);

        config.popup.buttonCollection.forEach((button: ButtonConfig) => (button.action = button.action.bind(this)));
        this._stepList.push(step);
        this._stepMap.set(config.id, step);
    }

    public removeStep(stepId: StepId): void {
        this._stepList = this._stepList.filter((step: TourStep) => stepId !== step.id);

        this._stepMap.delete(stepId);
    }

    public start(): void {
        this.isStarted = true;

        this._popupElement = createElement('div', ['overview', this._config.className ?? '']);
        document.body.appendChild(this._popupElement);

        this._helperElement = createElement('div', ['overview-helper', this._config.helperClassName ?? '']);
        document.body.appendChild(this._helperElement);

        this.next();
    }

    public complete(): void {
        this.isStarted = false;

        if (this._popupElement) {
            document.body.removeChild(this._popupElement);
        }

        if (this._helperElement) {
            document.body.removeChild(this._helperElement);
        }
    }

    public prev(): void {
        this._currentStep?.hide();

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

        this._currentStep?.hide();

        if (stepIndex >= this._stepList.length) {
            this.complete();
            return;
        }

        this._currentStep = this._stepList[stepIndex];
        this._currentStep.show();
    }

    private setUpStrategies(): void {
        this.updatePopupStrategies.set('default', new DefaultStepStrategy());
        this.updatePopupStrategies.set('custom', new CustomStepStrategy());
    }

    private setUpBodySizeObserver(): void {
        this._bodyResizeObserver = new ResizeObserver(() => {
            if (this.isStarted) {
                this._currentStep?.updatePopupPosition();
            }
        });

        this._bodyResizeObserver.observe(document.body);
    }
}
