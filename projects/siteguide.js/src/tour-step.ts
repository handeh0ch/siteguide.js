import { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { Tour } from './tour';
import { PopupData } from './types/popup.type';
import { PopupHost, StepId, TourStepConfig } from './types/tour-step-config.type';
import { isDefined, isNullOrUndefined } from './utils/base.util';

export class TourStep {
    public get isFirst(): boolean {
        return this.tour.stepList.indexOf(this) === 0;
    }

    public get nextStep(): TourStep | null {
        return this.tour.stepList[this.tour.stepList.indexOf(this) + 1] ?? null;
    }

    public get prevStep(): TourStep | null {
        return this.tour.stepList[this.tour.stepList.indexOf(this) - 1] ?? null;
    }

    public get hasHost(): boolean {
        return isDefined(this._hostElement);
    }

    public get hostElement(): HTMLElement | null {
        return this._hostElement;
    }

    public readonly id: StepId;
    public readonly popupData: PopupData;
    public readonly tour: Tour;

    private _hostElement: HTMLElement | null = null;

    private readonly _hostData: PopupHost | undefined;
    private readonly _popupRenderer: IRenderer;
    private readonly _helperRenderer: IRenderer;

    public constructor(tour: Tour, config: TourStepConfig) {
        this.id = config.id;
        this.popupData = config.popup;
        this.tour = tour;
        this._hostData = config.host;
        this._popupRenderer = tour.popupRenderer;
        this._helperRenderer = tour.helperRenderer;
    }

    public async show(): Promise<void> {
        if (isNullOrUndefined(this.tour.popup) || isNullOrUndefined(this.tour.helperLayout)) {
            return;
        }

        if (this._hostData) {
            this._hostElement = this.resolveHostElement(
                typeof this._hostData === 'function' ? this._hostData() : (this._hostData ?? null)
            );
        }

        await Promise.all([
            this._helperRenderer.render(this.tour.helperLayout, this),
            this._popupRenderer.render(this.tour.popup, this),
        ]);
    }

    private resolveHostElement(hostElement: string | HTMLElement): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }
}
