import type { EventCallBackType, IEvent } from "../types/EventEmitterTypes";

/**
 * Event Emitter class
 *
 * Type of Events that match a string to a callback, one key - one listener
 * @public
 */
export class EventEmitter<T extends string, K extends string> {
  private _listeners: IEvent<T> = new Map();

  constructor() {}

  on<P extends T>(eventName: K, listener: EventCallBackType<T & P>): void {
    if (listener) {
      this._listeners.set(eventName, listener as EventCallBackType<T>);
    }
  }

  off(eventName: K): void {
    this._listeners.delete(eventName);
  }

  emit(eventName: K, data: T): void {
    const _event = this._listeners.get(eventName);
    if (_event) {
      _event(data);
    }
  }

  dispose() {
    this._listeners = new Map();
  }
}
