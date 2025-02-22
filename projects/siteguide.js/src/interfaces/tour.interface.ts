import { IRenderer } from 'popup-renderer/interfaces/renderer.interface';
import { PopupData } from 'types/popup.type';
import { RequiredTourConfig } from '../types/tour-config.type';
import { StepId, TourStepConfig } from '../types/tour-step-config.type';

/**
 * @deprecated need to rethink
 * Made for resolving circular dependencies
 */
export interface ITour {
    get stepList(): readonly ITourStep[];
    get config(): RequiredTourConfig;
    get popup(): HTMLElement | null;
    get highlight(): HTMLElement | null;
    get popupRenderer(): IRenderer;
    get highlightRenderer(): IRenderer;
    addStep(config: TourStepConfig): void;
    addSteps(steps: TourStepConfig[]): void;
    removeStep(stepId: StepId): void;
    start(): void;
    complete(): void;
    prev(): void;
    next(): void;
}

/**
 * @deprecated need to rethink
 * Made for resolving circular dependencies
 */
export interface ITourStep {
    readonly id: StepId;
    readonly popupData: PopupData;
    readonly tour: ITour;
    get isFirst(): boolean;
    get nextStep(): ITourStep | null;
    get prevStep(): ITourStep | null;
    get hasHost(): boolean;
    get hostElement(): HTMLElement | null;
    show(): Promise<void>;
}
