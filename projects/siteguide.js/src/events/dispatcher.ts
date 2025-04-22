import { isDefined, isNullOrUndefined } from '../utils/base.util';
import { DispatcherEvent } from './dispatcher-event';
import { TourEventCallback } from './types/tour-event-listener.type';
import { TourEventType } from './types/tour-event.type';

export class Dispatcher {
    private readonly _events: Map<TourEventType, DispatcherEvent> = new Map();

    public on(type: TourEventType, callback: TourEventCallback): void {
        let event: DispatcherEvent | undefined = this._events.get(type);
        if (!event) {
            event = new DispatcherEvent(type);
            this._events.set(type, event);
        }

        event.registerCallback(callback);
    }

    public off(type: TourEventType, callback?: TourEventCallback): void {
        const event: DispatcherEvent | undefined = this._events.get(type);

        if (isDefined(event) && isNullOrUndefined(callback)) {
            this._events.delete(type);

            return;
        }

        if (event && isDefined(callback) && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);

            if (event.callbacks.length === 0) {
                this._events.delete(type);
            }
        }
    }

    protected dispatch(type: TourEventType): void {
        const event: DispatcherEvent | undefined = this._events.get(type);

        if (event) {
            event.fire(this);
        }
    }
}
