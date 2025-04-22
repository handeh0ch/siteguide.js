import { IRenderer } from 'popup-renderer/interfaces/renderer.interface';
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
    private _resizeObserver: ResizeObserver | null = null;

    private readonly _popupRenderer: IRenderer;
    private readonly _highlightRenderer: IRenderer;
    private readonly _interactionRenderer: IRenderer;
    private readonly _backgroundRenderer: IRenderer;

    public constructor(
        tour: Tour,
        config: TourStepConfig,
        popupRenderer: IRenderer,
        highlightRenderer: IRenderer,
        interactionRenderer: IRenderer,
        backgroundRenderer: IRenderer
    ) {
        this.popupData = config.popup;
        this.tour = tour;
        this._index = config.index ?? null;
        this._hostData = config.host;
        this._popupRenderer = popupRenderer;
        this._highlightRenderer = highlightRenderer;
        this._interactionRenderer = interactionRenderer;
        this._backgroundRenderer = backgroundRenderer;
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

        this._resizeObserver = this.listenHostResize();

        const renderersPromises = [];

        if (isDefined(this.tour.background)) {
            renderersPromises.push(this._backgroundRenderer.render(this.tour.background, this));
        }

        if (!this.tour.config.highlight.disable && !isNullOrUndefined(this.tour.highlight)) {
            renderersPromises.push(this._highlightRenderer.render(this.tour.highlight, this));
        }
        if (this.tour.config.highlight.disable && isDefined(this.tour.highlight)) {
            this._highlightRenderer.render(this.tour.highlight, {} as TourStep);
        }

        if (this.tour.config.interaction.disable && isDefined(this.tour.interaction)) {
            renderersPromises.push(this._interactionRenderer.render(this.tour.interaction, this));
        } else if (!this.tour.config.interaction.disable && isDefined(this.tour.interaction)) {
            renderersPromises.push(this._interactionRenderer.render(this.tour.interaction, {} as TourStep));
        }

        renderersPromises.push(this._popupRenderer.render(this.tour.popup, this));

        await Promise.all(renderersPromises);

        this.toggleHostClass(true);
    }

    public async hide(): Promise<void> {
        this._resizeObserver?.disconnect();
        this.toggleHostClass(false);
    }

    private toggleHostClass(enable: boolean): void {
        if (isNullOrUndefined(this._hostElement)) {
            return;
        }

        if (enable) {
            this._hostElement.classList.add('siteguide-host');
            this._hostElement.parentElement?.classList.add('siteguide-host-parent');
        } else {
            this._hostElement.classList.remove('siteguide-host');
            this._hostElement.parentElement?.classList.remove('siteguide-host-parent');
        }
    }

    private resolveHostElement(hostElement: string | Element): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }

    private listenHostResize(): ResizeObserver {
        const observer: ResizeObserver = new ResizeObserver(() => {
            if (isNullOrUndefined(this.tour.activeStep) || isNullOrUndefined(this.hostElement)) {
                return;
            }

            const rect: DOMRect = this.hostElement.getBoundingClientRect();

            let step: TourStep = this;
            if (rect.width === 0 && rect.height === 0) {
                step = {} as TourStep;
            }

            if (isDefined(this.tour.popup)) {
                this._popupRenderer.updatePosition(this.tour.popup, step);
            }

            if (isDefined(this.tour.highlight) && !this.tour.config.highlight.disable) {
                this._highlightRenderer.updatePosition(this.tour.highlight, step);
            }

            if (isDefined(this.tour.interaction) && this.tour.config.interaction.disable) {
                this._interactionRenderer.updatePosition(this.tour.interaction, step);
            }
        });

        if (isDefined(this._hostElement)) {
            observer.observe(this._hostElement);
        }

        return observer;
    }
}
