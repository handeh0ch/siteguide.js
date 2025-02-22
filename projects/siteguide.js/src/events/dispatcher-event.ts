import { TourEventCallback } from './types/tour-event-listener.type';
import { TourEventType } from './types/tour-event.type';

export class DispatcherEvent {
    public get callbacks(): ReadonlyArray<TourEventCallback> {
        return this._callbacks;
    }

    private readonly _event: TourEventType | null = null;
    private readonly _callbacks: TourEventCallback[] = [];

    constructor(event: TourEventType) {
        this._event = event;
    }

    public registerCallback(callback: TourEventCallback): void {
        this._callbacks.push(callback);
    }

    public unregisterCallback(callback: TourEventCallback): void {
        const index: number = this.callbacks.indexOf(callback);

        if (index > -1) {
            this._callbacks.splice(index, 1);
        }
    }

    public fire(): void {
        const callbacks: TourEventCallback[] = this._callbacks.slice(0);

        callbacks.forEach((callback: TourEventCallback) => {
            callback();
        });
    }
}
