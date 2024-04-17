import type { IQueueItem } from "@/lib/interfaces/queue";
import NowPlayingCard from "@components/cards/NowPlayingCard";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<NowPlayingCard />", () => {
  // Define the mock component props.
  const title = "Item Title";
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
    expect(el).toHaveTextContent(title);
  });
});
