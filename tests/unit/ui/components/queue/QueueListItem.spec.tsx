import QueueListItem from "@components/queue/QueueListItem";
import type { IQueueItem } from "@interfaces/queue";
import { render, screen, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("<QueueListItem />", () => {
  // Define the component props.
  const title = "tHiS IS-thE-TItle";
  const line = "This is the content line";
  const item: IQueueItem = {
    qid: Date.now(),
    title,
    content: [[line]],
  };
  const playFn = vi.fn();
  const dequeueFn = vi.fn();

  // Define the user for events.
  const user = userEvent.setup();

  test("it renders correctly", () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueListItem
        item={item}
        playHandler={playFn}
        dequeueHandler={dequeueFn}
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

  test("it calls the play function when clicked", async () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueListItem
        item={item}
        playHandler={playFn}
        dequeueHandler={dequeueFn}
      />
    ));

    // Get the elements from the vDOM.
    const el = screen.getByTitle("play");
    await user.click(el);
    await user.click(el);

    // Make the assertions.
    expect(playFn).toHaveBeenCalledTimes(2);
  });

  test("it calls the remove function when clicked", async () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueListItem
        item={item}
        playHandler={playFn}
        dequeueHandler={dequeueFn}
      />
    ));

    // Get the elements from the vDOM.
    const el = screen.getByTitle("remove");
    await user.click(el);
    await user.click(el);

    // Make the assertions.
    expect(dequeueFn).toHaveBeenCalledTimes(2);
  });
});
