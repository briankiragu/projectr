import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock the MeiliSearch module before importing
vi.mock("meilisearch", () => {
  const mockSearchGet = vi.fn();
  return {
    MeiliSearch: vi.fn().mockImplementation(() => ({
      index: vi.fn().mockReturnValue({
        searchGet: mockSearchGet,
      }),
    })),
    __mockSearchGet: mockSearchGet,
  };
});

// Import after mocking
import useMeiliSearch from "@composables/apis/useMeiliSearch";
import { MeiliSearch } from "meilisearch";

describe("useMeiliSearch", () => {
  let mockSearchGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get the mock function from the mocked module
    const mockClient = new MeiliSearch({ host: "" });
    const mockIndex = mockClient.index("test");
    mockSearchGet = mockIndex.searchGet as ReturnType<typeof vi.fn>;
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

    expect(results).toEqual(mockResults);
  });

  test("it returns empty hits when no results", async () => {
    mockSearchGet.mockResolvedValueOnce({ hits: [] });

    const { searchMeiliSearch } = useMeiliSearch();
    const results = await searchMeiliSearch("nonexistent");

    expect(results.hits).toHaveLength(0);
  });
});
