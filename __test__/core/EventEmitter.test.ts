import { expect, test, describe, vi } from "vitest";
import { EventEmitter } from "../../src/core/EventEmitter";

describe("Testing `Event Emitter` Functionality", () => {
  test("Testing For `on` event", () => {
    const mockFn = vi.fn();
    const eventEmitter = new EventEmitter();

    eventEmitter.on("event", mockFn);

    eventEmitter.emit("event", "data");

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith("data");
  });

  test("Testing For `off` event", () => {
    const mockFn = vi.fn();
    const eventEmitter = new EventEmitter();

    eventEmitter.on("event", mockFn);

    eventEmitter.off("event");

    eventEmitter.emit("event", "data");

    expect(mockFn).not.toHaveBeenCalled();
  });

  test("Testing For `dispose`", () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const eventEmitter = new EventEmitter();

    eventEmitter.on("event1", mockFn1);
    eventEmitter.on("event2", mockFn2);

    eventEmitter.dispose();

    eventEmitter.emit("event1", "data1");
    eventEmitter.emit("event2", "data2");

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn1).not.toHaveBeenCalled();
  });
});
