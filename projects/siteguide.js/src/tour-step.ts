import { Tour } from './tour';
import { PopupData } from './types/popup.type';
import { StepDirection } from './types/step-direction.type';
import { PopupHost, TourStepConfig } from './types/tour-step-config.type';
import { isDefined, isNullOrUndefined } from './utils/base.util';

export class TourStep {
    public get isFirst(): boolean {
        return this.tour.stepList.indexOf(this) === 0;
    }

    public get direction(): StepDirection {
        return this._direction;
    }

    public get hasHost(): boolean {
        return isDefined(this._hostElement);
    }

    public get hostElement(): HTMLElement | null {
        return this._hostElement;
    }

    public get index(): number | null {
        return this._index;
    }

    public set index(value: number) {
        this._index = value;
    }

    public readonly popupData: PopupData;
    public readonly tour: Tour;

    private _index: number | null;

    private _hostElement: HTMLElement | null = null;

    private _direction: StepDirection = 'toNext';
    private readonly _hostData: PopupHost | undefined;

    public constructor(tour: Tour, config: TourStepConfig) {
        this.popupData = config.popup;
        this.tour = tour;
        this._index = config.index ?? null;
        this._hostData = config.host;
    }

    public async show(direction: StepDirection): Promise<void> {
        if (isNullOrUndefined(this.tour.popup)) {
            return;
        }

        this._direction = direction;

        if (this._hostData) {
            this._hostElement = this.resolveHostElement(
                typeof this._hostData === 'function' ? this._hostData() : (this._hostData ?? null)
            );
        }

        const renderersPromises = [this.tour.popupRenderer.render(this.tour.popup, this)];

        if (!this.tour.config.interaction.disable && isDefined(this.tour.interaction)) {
            renderersPromises.push(this.tour.interactionRenderer.render(this.tour.interaction, this));
        }

        if (!this.tour.config.highlight.disable && !isNullOrUndefined(this.tour.highlight)) {
            renderersPromises.push(this.tour.highlightRenderer.render(this.tour.highlight, this));
        }

        if (this.tour.config.highlight.disable && isDefined(this.tour.highlight)) {
            this.tour.highlightRenderer.render(this.tour.highlight, {} as TourStep);
        }

        await Promise.all(renderersPromises);

        this.toggleHostClass(true);
    }

    public async hide(): Promise<void> {
        this.toggleHostClass(false);
    }

    private toggleHostClass(enable: boolean): void {
        if (isNullOrUndefined(this._hostElement)) {
            return;
        }

        if (enable) {
            this._hostElement.classList.add('siteguide-host');
        } else {
            this._hostElement.classList.remove('siteguide-host');
        }
    }

    private resolveHostElement(hostElement: string | Element): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }
}
