import LyricsSearch from "@components/search/lyrics/LyricsSearch";
import type { ISearchItem } from "@interfaces/lyric";
import { ISource, IStatus } from "@interfaces/lyric";
import { render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock useMeiliSearch
vi.mock("@composables/apis/useMeiliSearch", () => ({
  default: () => ({
    searchMeiliSearch: vi.fn().mockResolvedValue({ hits: [] }),
  }),
}));

// Mock useTracks
vi.mock("@composables/useTracks", () => ({
  default: () => ({
    searchItemToQueueItem: vi.fn((item) => ({
      qid: Date.now(),
      title: item.title,
      artists: item.artists,
      content: item.content,
    })),
  }),
}));

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

describe("<LyricsSearch />", () => {
  // Define the component props.
  const results: ISearchItem[] = [];
  const searchFn = vi.fn();
  const enqueueFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it renders correctly", () => {
    // Render the element on the vDOM.
    render(() => (
      <LyricsSearch
        results={results}
        searchHandler={searchFn}
        enqueueHandler={enqueueFn}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByTestId("lyrics-search");

    // Make the assertions.
    expect(el).toBeInTheDocument();
  });

  test("it shows search form", () => {
    // Render the element on the vDOM.
    render(() => (
      <LyricsSearch
        results={results}
        searchHandler={searchFn}
        enqueueHandler={enqueueFn}
      />
    ));

    // Search form should be visible
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  test("it does not show results when results array is empty", () => {
    // Render the element on the vDOM.
    render(() => (
      <LyricsSearch
        results={[]}
        searchHandler={searchFn}
        enqueueHandler={enqueueFn}
      />
    ));

    // Results list should not be visible
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("it shows results when results array has items", async () => {
    const resultsWithItems: ISearchItem[] = [
      {
        title: "Test Song",
        content: [["Test lyrics"]],
        source: ISource.musix,
        status: IStatus.PUBLISHED,
        sort: null,
      },
    ];

    // Render the element on the vDOM.
    render(() => (
      <LyricsSearch
        results={resultsWithItems}
        searchHandler={searchFn}
        enqueueHandler={enqueueFn}
      />
    ));

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });

  test("hasResults returns correct value based on results", () => {
    const resultsWithItems: ISearchItem[] = [
      {
        title: "Test Song",
        content: [["Test lyrics"]],
        source: ISource.musix,
        status: IStatus.PUBLISHED,
        sort: null,
      },
      {
        title: "Another Song",
        content: [["More lyrics"]],
        source: ISource.meili,
        status: IStatus.PUBLISHED,
        sort: null,
      },
    ];

    // Render the element on the vDOM.
    render(() => (
      <LyricsSearch
        results={resultsWithItems}
        searchHandler={searchFn}
        enqueueHandler={enqueueFn}
      />
    ));

    // Check that the list is rendered (hasResults is true when results.length > 0)
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });
});
