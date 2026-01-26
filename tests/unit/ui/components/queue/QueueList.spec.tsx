import QueueList from "@components/queue/QueueList";
import type { IQueueItem } from "@interfaces/queue";
import { render, screen, within, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock useFormatting
vi.mock("@composables/useFormatting", () => ({
  default: () => ({
    toTitleCase: (phrase?: string) =>
      phrase
        ? phrase
            .toLowerCase()
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : null,
  }),
}));

describe("<QueueList />", () => {
  // Declare the component props.
  const title = "thIs IS-tHE-tiTLe";
  const line = "This is a line from a verse";
  const queue: IQueueItem[] = [
    { qid: 1, title, content: [[line]] },
    { qid: 2, title: "second-item", content: [["Second line"]] },
  ];
  const playFn = vi.fn();
  const queueFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test("it renders the correct number of queue items", async () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueList queue={queue} playHandler={playFn} queueHandler={queueFn} />
    ));

    // Wait for lazy-loaded items to appear
    const items = await screen.findAllByTestId("queue-list-item");

    // Make the assertions.
    expect(items).toHaveLength(2);
  });

  test("it calls playHandler with correct id when play is clicked", async () => {
    const user = userEvent.setup();

    // Render the component on the vDOM.
    render(() => (
      <QueueList queue={queue} playHandler={playFn} queueHandler={queueFn} />
    ));

    // Wait for items to load and find play buttons
    await waitFor(async () => {
      const playButtons = await screen.findAllByTitle("play");
      expect(playButtons.length).toBeGreaterThan(0);
    });

    const playButtons = await screen.findAllByTitle("play");
    await user.click(playButtons[0]);

    // Make the assertions.
    expect(playFn).toHaveBeenCalledWith(1);
  });

  test("it calls queueHandler with correct id when remove is clicked", async () => {
    const user = userEvent.setup();

    // Render the component on the vDOM.
    render(() => (
      <QueueList queue={queue} playHandler={playFn} queueHandler={queueFn} />
    ));

    // Wait for items to load and find remove buttons
    await waitFor(async () => {
      const removeButtons = await screen.findAllByTitle("remove");
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    const removeButtons = await screen.findAllByTitle("remove");
    await user.click(removeButtons[1]);

    // Make the assertions.
    expect(queueFn).toHaveBeenCalledWith(2);
  });

  test("it renders empty list when queue is empty", () => {
    // Render the component on the vDOM.
    render(() => (
      <QueueList queue={[]} playHandler={playFn} queueHandler={queueFn} />
    ));

    // Get the element from the vDOM.
    const el = screen.getByTestId("queue-list");

    // Make the assertions.
    expect(el).toBeInTheDocument();
    expect(el.children.length).toBe(0);
  });
});
