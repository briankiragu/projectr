import LyricsSearchResults from "@components/search/lyrics/LyricsSearchResults";
import { ISource, IStatus, type ISearchItem } from "@interfaces/lyric";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

// Mock the useTracks composable
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

describe("<LyricsSearchResults />", () => {
  // Define the component props.
  const title = "ThIs IS-tHe-tItLe";
  const line = "This is a line";
  const results: ISearchItem[] = [
    {
      title,
      content: [[line]],
      source: ISource.musix,
      status: IStatus.PUBLISHED,
      sort: null,
    },
  ];
  const enqueueFn = vi.fn();

  test("it renders correctly", () => {
    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResults results={results} enqueueHandler={enqueueFn} />
    ));

    // Get the component from the vDOM.
    const el = screen.getByRole("list");

    // Make the assertions.
    expect(el).toBeInTheDocument();
  });

  test("it renders the correct number of list items", async () => {
    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResults results={results} enqueueHandler={enqueueFn} />
    ));

    // Get the list items from the vDOM (async because LyricsSearchResultsItem is lazy-loaded).
    const items = await screen.findAllByRole("listitem");

    // Make the assertions.
    expect(items).toHaveLength(1);
  });
});
