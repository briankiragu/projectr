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
    content: [["Verse 1"], ["Verse 2"], ["Verse 3"]],
  };
  const track4: IQueueItem = {
    qid: 4,
    title: "Track 4",
    content: [["Verse 1"], ["Verse 2"]],
  };
  const track5: IQueueItem = {
    qid: 5,
    title: "Track 5",
    content: [["Verse 1"], ["Verse 2"], ["Verse 3"]],
  };

  // Define the composable.
  const {
    dequeue,
    enqueue,
    flush,
    peek,
    setNowPlaying,
    isFirstVerse,
    isLastVerse,
    goToNextVerse,
    goToPreviousVerse,
    goToVerse,
  } = useQueue();

  test("it can enqueue, peek, dequeue and flush", () => {
    // Make the assertion.
    expect(peek()).toStrictEqual(undefined);

    // Add items to the queue.
    enqueue(track1);
    enqueue(track2, track3);
    enqueue(...[track4, track5]);

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

  test("it can go to the next, previous or any specific verse", () => {
    // Set the now playing
    setNowPlaying(track3);

    // Make the assertions.
    expect(isFirstVerse()).toBe(true);
    expect(isLastVerse()).toBe(false);

    // Go to the next (last verse)
    goToNextVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(false);

    // Go to the next (last verse)
    goToNextVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(true);

    // Go to the previous (first verse)
    goToPreviousVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(false);

    // Go to the previous (first verse)
    goToVerse(0);

    // Make the assertions.
    expect(isFirstVerse()).toBe(true);
    expect(isLastVerse()).toBe(false);
  });
});
