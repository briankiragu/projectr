import { describe, expect, test, vi, beforeEach } from "vitest";
import useTracks from "@composables/useTracks";
import { ISource, IStatus } from "@interfaces/lyric";

// Mock the useMeiliSearch composable
vi.mock("@composables/apis/useMeiliSearch", () => ({
  default: () => ({
    searchMeiliSearch: vi.fn().mockResolvedValue({
      hits: [
        {
          title: "Test Track",
          content: "Line 1\nLine 2\n\nLine 3\nLine 4",
          artists: "Artist 1;Artist 2",
          status: IStatus.PUBLISHED,
          sort: null,
        },
        {
          title: "Another Track",
          content: "Verse 1",
          status: IStatus.PUBLISHED,
          sort: null,
        },
      ],
    }),
  }),
}));

// Mock the useFormatting composable
vi.mock("@composables/useFormatting", () => ({
  default: () => ({
    fromEditableLyrics: (content: string) =>
      content
        .split(/\n\n/g)
        .filter((verse) => verse.length)
        .map((verse) => verse.split(/\n/g)),
  }),
}));

describe("useTracks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it searches for tracks and returns formatted results", async () => {
    const { searchTracks } = useTracks();

    const results = await searchTracks("test");

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("Test Track");
    expect(results[0].content).toEqual([
      ["Line 1", "Line 2"],
      ["Line 3", "Line 4"],
    ]);
    expect(results[0].artists).toEqual(["Artist 1", "Artist 2"]);
    expect(results[0].source).toBe(ISource.meili);
  });

  test("it converts a search item to a queue item", () => {
    const { searchItemToQueueItem } = useTracks();

    const searchItem = {
      title: "Test Song",
      content: [["Line 1"], ["Line 2"]],
      artists: ["Artist"],
      source: ISource.meili,
      status: IStatus.PUBLISHED,
      sort: null,
    };

    const queueItem = searchItemToQueueItem(searchItem);

    expect(queueItem).toMatchObject({
      title: "Test Song",
      content: [["Line 1"], ["Line 2"]],
      artists: ["Artist"],
    });
    expect(queueItem.qid).toBeDefined();
    expect(typeof queueItem.qid).toBe("number");
  });

  test("it handles tracks without artists", async () => {
    const { searchTracks } = useTracks();

    const results = await searchTracks("another");

    // The second track doesn't have artists
    expect(results[1].artists).toBeUndefined();
  });
});
