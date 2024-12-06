import { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import { Tour } from './tour';
import { PopupData } from './types/popup.type';
import { PopupHost, StepId, TourStepConfig } from './types/tour-step-config.type';
import { isNullOrUndefined } from './utils/base.util';

export class TourStep {
    public get hostElement(): HTMLElement | null {
        return this._hostElement;
    }

    public readonly id: StepId;
    public readonly popupData: PopupData;
    public readonly tour: Tour;

    private _hostElement: HTMLElement | null = null;

    private readonly _hostData: PopupHost;
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

    public show(): void {
        if (isNullOrUndefined(this.tour.popup) || isNullOrUndefined(this.tour.helperLayout)) {
            return;
        }

        this._hostElement = this.resolveHostElement(
            typeof this._hostData === 'function' ? this._hostData() : this._hostData
        );

        this._popupRenderer.render(this.tour.popup, this);
        this._helperRenderer.render(this.tour.helperLayout, this);
    }

    private resolveHostElement(hostElement: string | HTMLElement): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }
}
