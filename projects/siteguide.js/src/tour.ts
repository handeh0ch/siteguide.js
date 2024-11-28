import { DeepRequired } from 'types/utility.type';
import { IUpdatePopup } from './element-creator/interfaces/update-popup.interface';
import { CustomStepStrategy } from './element-creator/strategies/custom-step.strategy';
import { TextStepStrategy } from './element-creator/strategies/text-step.strategy';
import { TourStep } from './tour-step';
import { ButtonConfig } from './types/button-config.type';
import { PopupType } from './types/popup.type';
import { TourConfig } from './types/tour-config.type';
import { StepId, TourStepConfig } from './types/tour-step-config.type';
import { createElement } from './utils/create-element.util';

export class Tour {
    public get stepList(): readonly TourStep[] {
        return this._stepList as Readonly<TourStep[]>;
    }

    public get config(): DeepRequired<TourConfig> {
        return this._config;
    }

    /**
     * Popup element getter
     * @returns {HTMLElement | null} The popup element or null if not found.
     * @example siteguide popup layout
     *
     * <div class="siteguide">
     *     <div class="siteguide-header">
     *         <h1 class="siteguide-title"></h1>
     *         <div class="siteguide-close"></div>
     *     </div>
     *     <div class="siteguide-content"></div>
     *     <div class="siteguide-footer">
     *         <button class="siteguide-button"></button>
     *         <button class="siteguide-button"></button>
     *     </div>
     * </div>
     */
    public get popup(): HTMLElement | null {
        return this._popup;
    }

    public get helperLayout(): HTMLElement | null {
        return this._helperLayout;
    }

    /**
     * TODO remove
     * @deprecated remove later
     */
    public isStarted: boolean = false;

    public readonly updatePopupStrategies: Map<PopupType, IUpdatePopup> = new Map();

    private _popup: HTMLElement | null = null;
    private _helperLayout: HTMLElement | null = null;

    private readonly _stepMap: Map<StepId, TourStep> = new Map();
    private _stepList: TourStep[] = [];
    private _currentStep: TourStep | null = null;
    private _bodyResizeObserver!: ResizeObserver;
    private readonly _config: DeepRequired<TourConfig>;

    public constructor(config: TourConfig) {
        this.setUpStrategies();
        this.setUpBodySizeObserver();

        this._config = {
            classPrefix: config.classPrefix ?? 'siteguide',
            options: {
                scrollTo: config.options?.scrollTo ?? true,
            },
        };
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
        this.updatePopupStrategies.set('text', new TextStepStrategy());
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
