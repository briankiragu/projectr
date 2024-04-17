import NowPlayingCard from "@components/cards/NowPlayingCard";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render, screen, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<NowPlayingCard />", () => {
  // Define the mock component props.
  const title = "IteM-tItLE";
  const line = "Line of the item";

  const item: IQueueItem = {
    qid: Date.now(),
    title,
    content: [[line]],
  };
  const fn = vi.fn();

  // Cleanup the mounted components after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the item in the vDOM.
    render(() => <NowPlayingCard item={item} handler={fn} />);

    // Get the element from the vDOM.
    const el = screen.getByTestId("now-playing-card");

    // Assert the displayed data.
    expect(el).toHaveTextContent("Item Title");
  });

  test("it calls the function passed to it when clicked", async () => {
    // Render the item in the vDOM.
    render(() => <NowPlayingCard item={item} handler={fn} />);

    // Get the element from the vDOM.
    const el = screen.getByTestId("now-playing-card");
    const button = within(el).getByRole("button");
    const user = userEvent.setup();

    // Interact with the element in  the vDOM.
    await user.click(button);
    await user.click(button);

    // Make the assertions.
    expect(fn).toBeCalledTimes(2);
  });
});
