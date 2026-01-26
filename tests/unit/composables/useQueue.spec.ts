import useQueue from "@composables/useQueue";
import type { IQueueItem } from "@interfaces/queue";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

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

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  test("it can enqueue, peek, dequeue and flush", () => {
    // Define the composable inside the test.
    const { dequeue, enqueue, flush, peek } = useQueue();

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

    // Remove second item from the queue (by qid).
    dequeue(3);

    // Make the assertion.
    expect(peek()).toStrictEqual(track2);

    // Clear the queue.
    flush();

    // Make the assertion.
    expect(peek()).toStrictEqual(undefined);
  });

  test("it can go to the next, previous or any specific verse", () => {
    // Define the composable inside the test.
    const {
      setNowPlaying,
      isFirstVerse,
      isLastVerse,
      goToNextVerse,
      goToPreviousVerse,
      goToVerse,
    } = useQueue();

    // Set the now playing
    setNowPlaying(track3);

    // Make the assertions.
    expect(isFirstVerse()).toBe(true);
    expect(isLastVerse()).toBe(false);

    // Go to the next verse
    goToNextVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(false);

    // Go to the next (last verse)
    goToNextVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(true);

    // Go to the previous verse
    goToPreviousVerse();

    // Make the assertions.
    expect(isFirstVerse()).toBe(false);
    expect(isLastVerse()).toBe(false);

    // Go to the first verse
    goToVerse(0);

    // Make the assertions.
    expect(isFirstVerse()).toBe(true);
    expect(isLastVerse()).toBe(false);
  });

  test("it does not go past the last verse", () => {
    const { setNowPlaying, goToNextVerse, currentVerseIndex } = useQueue();

    // Set content with 2 verses
    setNowPlaying(track1);

    // Try to go past the last verse
    goToNextVerse();
    goToNextVerse();
    goToNextVerse();

    // Should be at last index (1)
    expect(currentVerseIndex()).toBe(1);
  });

  test("it does not go before the first verse", () => {
    const { setNowPlaying, goToPreviousVerse, currentVerseIndex } = useQueue();

    setNowPlaying(track1);

    // Try to go before the first verse
    goToPreviousVerse();
    goToPreviousVerse();

    // Should stay at 0
    expect(currentVerseIndex()).toBe(0);
  });

  test("it can set and get editing state", () => {
    const { isEditing, setIsEditing } = useQueue();

    expect(isEditing()).toBe(false);

    setIsEditing(true);
    expect(isEditing()).toBe(true);

    setIsEditing(false);
    expect(isEditing()).toBe(false);
  });

  test("it exposes queue and nowPlaying signals", () => {
    const { queue, nowPlaying, setNowPlaying, enqueue } = useQueue();

    expect(queue).toEqual([]);
    expect(nowPlaying()).toBeUndefined();

    enqueue(track1);
    expect(queue.length).toBe(1);

    setNowPlaying(track2);
    expect(nowPlaying()).toEqual(track2);
  });
});
