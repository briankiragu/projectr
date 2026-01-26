import { beforeEach, describe, expect, test, vi } from "vitest";
import usePersistence from "@composables/usePersistence";
import type { IQueueItem } from "@interfaces/queue";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("usePersistence", () => {
  // Get the methods from the composable.
  const {
    getStoredQueue,
    setStoredQueue,
    getStoredNowPlaying,
    setStoredNowPlaying,
  } = usePersistence();

  // Define test data.
  const track1: IQueueItem = {
    qid: 1,
    title: "Track 1",
    content: [["Verse 1"], ["Verse 2"]],
  };
  const track2: IQueueItem = {
    qid: 2,
    title: "Track 2",
    content: [["Verse 1"]],
  };

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  test("it returns an empty array when no queue is stored", () => {
    const result = getStoredQueue();
    expect(result).toEqual([]);
  });

  test("it stores and retrieves the queue", () => {
    const queue = [track1, track2];
    setStoredQueue(queue);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "queue",
      JSON.stringify(queue)
    );
  });

  test("it returns undefined when no now playing is stored", () => {
    const result = getStoredNowPlaying();
    expect(result).toBeUndefined();
  });

  test("it returns undefined when now playing is stored as 'undefined'", () => {
    localStorageMock.getItem.mockReturnValueOnce("undefined");
    const result = getStoredNowPlaying();
    expect(result).toBeUndefined();
  });

  test("it stores and retrieves the now playing", () => {
    setStoredNowPlaying(track1);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "nowPlaying",
      JSON.stringify(track1)
    );
  });

  test("it stores undefined as now playing", () => {
    setStoredNowPlaying(undefined);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "nowPlaying",
      JSON.stringify(undefined)
    );
  });
});
