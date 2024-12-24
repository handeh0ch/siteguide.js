import { isDefined, isNullOrUndefined } from '../utils/base.util';
import { DispatcherEvent } from './dispatcher-event';
import { TourEventCallback } from './types/tour-event-listener.type';
import { TourEventType } from './types/tour-event.type';

export class Dispatcher {
    private readonly _events: Map<TourEventType, DispatcherEvent> = new Map();

    public on(eventName: TourEventType, callback: TourEventCallback) {
        let event: DispatcherEvent | undefined = this._events.get(eventName);
        if (!event) {
            event = new DispatcherEvent(eventName);
            this._events.set(eventName, event);
        }

        event.registerCallback(callback);
    }

    public off(eventName: TourEventType, callback?: TourEventCallback) {
        const event: DispatcherEvent | undefined = this._events.get(eventName);

        if (isDefined(event) && isNullOrUndefined(callback)) {
            this._events.delete(eventName);

            return;
        }

        if (event && isDefined(callback) && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);

            if (event.callbacks.length === 0) {
                this._events.delete(eventName);
            }
        }
    }

    public dispatch(eventName: TourEventType) {
        const event: DispatcherEvent | undefined = this._events.get(eventName);

        if (event) {
            event.fire();
        }
    }
}
