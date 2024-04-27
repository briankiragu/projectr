import useQueue from "@composables/useQueue";
import type { IQueueItem } from "@interfaces/queue";
import { describe, test } from "vitest";

describe("useQueue", () => {
  // Define the suite variables.
  const track1: IQueueItem = {
    qid: 1,
    title: "Track 1",
    content: [["Verse 1"], ["Verse 2"]],
  };
  const track2: IQueueItem = {
    qid: 2,
    title: "Track 2",
    content: [["Verse 1"], ["Verse 2"]],
  };
  const track3: IQueueItem = {
    qid: 3,
    title: "Track 3",
    content: [["Verse 1"], ["Verse 2"]],
  };

  // Define the composable.
  const { dequeue, enqueue, flush, peek } = useQueue();

  test("it can enqueue, peek, dequeue and flush", () => {
    // Make the assertion.
    expect(peek()).toStrictEqual(undefined);

    // Add items to the queue.
    enqueue(track1);
    enqueue(track2);
    enqueue(track3);

    // Make the assertion.
    expect(peek()).toStrictEqual(track1);

    // Remove first item from the queue.
    dequeue();

    // Make the assertion.
    expect(peek()).toStrictEqual(track2);

    // Remove second item from the queue.
    dequeue(3);

    // Make the assertion.
    expect(peek()).toStrictEqual(track2);

    // Clear the queue.
    flush();

    // Make the assertion.
    expect(peek()).toStrictEqual(undefined);
  });

  test.todo("it verifies if the current verse is the first", () => {});

  test.todo("it verifies if the current verse is the last", () => {});

  test.todo("it moves to the previous verse", () => {});

  test.todo("it moves to the next verse", () => {});

  test.todo("it moves to a specific verse", () => {});
});
