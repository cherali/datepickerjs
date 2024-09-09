/**
 * Type of event emitter callback
 * @public
 */
export type EventCallBackType<T> = (data: T) => void;

/**
 * Type of Event Emitter events
 * @public
 */
export type IEvent<T> = Map<string, EventCallBackType<T>>;
