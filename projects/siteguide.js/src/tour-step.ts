import { ITour } from 'interfaces/tour.interface';
import type { ITourStep } from './interfaces/tour.interface';
import type { IRenderer } from './popup-renderer/interfaces/renderer.interface';
import type { PopupData } from './types/popup.type';
import type { PopupHost, StepId, TourStepConfig } from './types/tour-step-config.type';
import { isDefined, isNullOrUndefined } from './utils/base.util';

export class TourStep implements ITourStep {
    public get isFirst(): boolean {
        return this.tour.stepList.indexOf(this) === 0;
    }

    public get nextStep(): ITourStep | null {
        return this.tour.stepList[this.tour.stepList.indexOf(this) + 1] ?? null;
    }

    public get prevStep(): ITourStep | null {
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
    public readonly tour: ITour;

    private _hostElement: HTMLElement | null = null;

    private readonly _hostData: PopupHost | undefined;
    private readonly _popupRenderer: IRenderer;
    private readonly _highlightRenderer: IRenderer;

    public constructor(tour: ITour, config: TourStepConfig) {
        this.id = config.id;
        this.popupData = config.popup;
        this.tour = tour;
        this._hostData = config.host;
        this._popupRenderer = tour.popupRenderer;
        this._highlightRenderer = tour.highlightRenderer;
    }

    public async show(): Promise<void> {
        if (isNullOrUndefined(this.tour.popup)) {
            return;
        }

        if (this._hostData) {
            this._hostElement = this.resolveHostElement(
                typeof this._hostData === 'function' ? this._hostData() : (this._hostData ?? null)
            );
        }

        const renderersPromises = [this._popupRenderer.render(this.tour.popup, this)];

        if (!this.tour.config.highlight.disable && !isNullOrUndefined(this.tour.highlight)) {
            renderersPromises.push(this._highlightRenderer.render(this.tour.highlight, this));
        }

        await Promise.all(renderersPromises);
    }

    private resolveHostElement(hostElement: string | Element): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }
}
