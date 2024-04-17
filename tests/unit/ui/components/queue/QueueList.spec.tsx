import QueueList from "@components/queue/QueueList";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<QueueList />", () => {
  // Declare the component props.
  const title = "thIs IS-tHE-tiTLe";
  const line = "This is a line from a verse";
  const queue: IQueueItem[] = [
    { qid: Date.now(), title, content: [[line]] },
    { qid: Date.now(), title, content: [[line]] },
  ];
  const playFn = vi.fn();
  const queueFn = vi.fn();

  // Clean up after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueList queue={queue} playHandler={playFn} queueHandler={queueFn} />
    ));

    // Get the element from the vDOM.
    const el = screen.getByTestId("queue-list");

    // Make the assertions.
    expect(el).toBeInTheDocument();
  });
});
