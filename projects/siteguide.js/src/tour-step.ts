import { Tour } from './tour';
import { PopupData } from './types/popup.type';
import { PopupHost, StepId, TourStepConfig } from './types/tour-step-config.type';
import { isNullOrUndefined } from './utils/base.util';

export class TourStep {
    public readonly id: StepId;

    private readonly _hostData: PopupHost;
    private readonly _popupData: PopupData;
    private readonly _tour: Tour;

    private _hostElement: HTMLElement | null = null;

    public constructor(tour: Tour, config: TourStepConfig) {
        this.id = config.id;
        this._hostData = config.host;
        this._popupData = config.popup;
        this._tour = tour;
    }

    public show(): void {
        this._hostElement = this.resolveHostElement(
            typeof this._hostData === 'function' ? this._hostData() : this._hostData
        );

        this.updatePopup();
    }

    public hide(): void {}

    public updatePopupPosition(): void {
        const rect: DOMRect = this._hostElement!.getBoundingClientRect();
        const paddingX: number = 8;
        const paddingY: number = 4;

        const position: string = this.resolvePopupPosition();

        this._tour.helperLayout!.style.position = position;

        this._tour.helperLayout!.style.left = `${rect.left - paddingX}px`;
        this._tour.helperLayout!.style.top = `${rect.top - paddingY}px`;
        this._tour.helperLayout!.style.width = `${rect.width + 2 * paddingX}px`;
        this._tour.helperLayout!.style.height = `${rect.height + 2 * paddingY}px`;

        this._tour.popup!.style.position = position;

        const popupHeight: number = this._tour.popup!.offsetHeight;
        const popupWidth: number = this._tour.popup!.offsetWidth;
        const viewportHeight: number = window.innerHeight;
        const viewportWidth: number = window.innerWidth;

        let top: number = rect.top + window.scrollY - popupHeight;
        let left: number = rect.left + window.scrollX;

        if (top < 0) {
            top = rect.bottom + window.scrollY;
        }

        if (left + popupWidth > viewportWidth) {
            left = rect.right + window.scrollX - popupWidth;
        }

        if (left < 0) {
            left = rect.left + window.scrollX;
        }

        if (top + popupHeight > viewportHeight) {
            top = rect.top + window.scrollY;
        }

        this._tour.popup!.style.left = `${left}px`;
        this._tour.popup!.style.top = `${top}px`;
    }

    private updatePopup(): void {
        if (!this._tour.updatePopupStrategies.has(this._popupData.type)) {
            throw new Error('Missing popup creator strategy');
        }

        this._tour.updatePopupStrategies
            .get(this._popupData.type)!
            .updatePopupView(this._tour.popup!, this._popupData, this._tour);

        this.updatePopupPosition();

        this._hostElement?.scrollIntoView(this._tour.config.scrollTo);
    }

    private resolveHostElement(hostElement: string | HTMLElement): HTMLElement | null {
        if (typeof this._hostData === 'string') {
            return document.querySelector(this._hostData);
        }

        return hostElement as HTMLElement;
    }

    private resolvePopupPosition(): string {
        let clone: HTMLElement | null = this.resolveHostElement(
            typeof this._hostData === 'function' ? this._hostData() : this._hostData
        );

        let position: string = 'absolute';

        while (!isNullOrUndefined(clone)) {
            if (clone?.style.position === 'fixed') {
                position = 'fixed';
            }

            clone = clone?.parentElement ?? null;
        }

        return position;
    }
}
