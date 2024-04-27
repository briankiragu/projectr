import useQueue from "@composables/useQueue";
import type { IQueueItem } from "@interfaces/queue";
import { describe, test } from "vitest";

describe("useQueue", () => {
  // Define the suite variables.
  const track1: IQueueItem = {
    qid: Date.now(),
    title: "Track 1",
    content: [["Verse 1"], ["Verse 2"]],
  };
  const track2: IQueueItem = {
    qid: Date.now(),
    title: "Track 2",
    content: [["Verse 1"], ["Verse 2"]],
  };

  // Define the composable.
  const { peek, enqueue } = useQueue();

  test("it returns the first value in the queue", () => {
    // Make the assertion.
    expect(peek()).toBe(undefined);

    // Add an item to the queue.
    enqueue(track1);
    enqueue(track2);

    // Make the assertion.
    expect(peek()).toStrictEqual(track1);
  });

  test.todo("it adds an item to the queue", () => {});

  test.todo("it removes an item from the queue", () => {});

  test.todo("it empties the queue", () => {});

  test.todo("it verifies if the current verse is the first", () => {});

  test.todo("it verifies if the current verse is the last", () => {});

  test.todo("it moves to the previous verse", () => {});

  test.todo("it moves to the next verse", () => {});

  test.todo("it moves to a specific verse", () => {});
});
