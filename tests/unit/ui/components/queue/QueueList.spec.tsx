import QueueList from "@components/queue/QueueList";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, test, vi } from "vitest";

describe("<QueueList />", () => {
  // Declare the component props.
  const queue: IQueueItem[] = [];
  const playFn = vi.fn();
  const queueFn = vi.fn();

  // Clean up after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    render(() => (
      <QueueList queue={queue} playHandler={playFn} queueHandler={queueFn} />
    ));
  });
});
