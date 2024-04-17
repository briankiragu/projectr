import QueueListItem from "@components/queue/QueueListItem";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render, screen, within } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<QueueListItem />", () => {
  // Define the component props.
  const title = "tHiS IS-thE-TItle";
  const line = "This is the content line";
  const item: IQueueItem = {
    qid: Date.now(),
    title,
    content: [[line]],
  };
  const dragFn = () => ({ onDragOver: vi.fn(), onDragStart: vi.fn() });
  const playFn = vi.fn();
  const queueFn = vi.fn();

  // Clean up the vDOM after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueListItem
        item={item}
        dragHandlers={dragFn}
        playHandler={playFn}
        queueHandler={queueFn}
      />
    ));

    // Get the elements from the vDOM.
    const el = screen.getByTestId("queue-list-item");
    const titleEl = within(el).getByRole("heading");
    const playButton = within(el).getByTitle("play");
    const removeButton = within(el).getByTitle("remove");

    // Make the assertions.
    expect(titleEl).toHaveTextContent("This Is The Title");
    expect(playButton).toHaveClass("material-symbols-outlined");
    expect(removeButton).toHaveClass("material-symbols-outlined");
  });
});
