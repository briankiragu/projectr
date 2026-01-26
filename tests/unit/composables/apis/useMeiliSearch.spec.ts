import { describe, expect, test, vi, beforeEach } from "vitest";

// Hoist the mock function so it's available during mock initialization
const mockSearchGet = vi.hoisted(() => vi.fn());

// Mock the MeiliSearch module before importing
vi.mock("meilisearch", () => ({
  MeiliSearch: vi.fn().mockImplementation(() => ({
    index: vi.fn().mockReturnValue({
      searchGet: mockSearchGet,
    }),
  })),
}));

// Import after mocking
import useMeiliSearch from "@composables/apis/useMeiliSearch";

describe("useMeiliSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it returns the searchMeiliSearch function", () => {
    const { searchMeiliSearch } = useMeiliSearch();

    expect(searchMeiliSearch).toBeDefined();
    expect(typeof searchMeiliSearch).toBe("function");
  });

  test("it searches MeiliSearch with a phrase", async () => {
    const mockResults = {
      hits: [
        { title: "Song 1", content: "Lyrics 1" },
        { title: "Song 2", content: "Lyrics 2" },
      ],
      estimatedTotalHits: 2,
    };

    mockSearchGet.mockResolvedValueOnce(mockResults);

    const { searchMeiliSearch } = useMeiliSearch();
    const results = await searchMeiliSearch("test song");

    expect(mockSearchGet).toHaveBeenCalledWith("test song", expect.any(Object));
    expect(results).toEqual(mockResults);
  });

  test("it returns empty hits when no results", async () => {
    mockSearchGet.mockResolvedValueOnce({ hits: [], estimatedTotalHits: 0 });

    const { searchMeiliSearch } = useMeiliSearch();
    const results = await searchMeiliSearch("nonexistent");

    expect(results.hits).toHaveLength(0);
  });

  test("it passes filter parameters to searchGet", async () => {
    mockSearchGet.mockResolvedValueOnce({ hits: [] });

    const { searchMeiliSearch } = useMeiliSearch();
    await searchMeiliSearch("worship");

    expect(mockSearchGet).toHaveBeenCalledWith(
      "worship",
      expect.objectContaining({
        filter: expect.stringContaining("account"),
      })
    );
  });
});
