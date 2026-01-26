import LyricsSearchResults from "@components/search/lyrics/LyricsSearchResults";
import { ISource, IStatus, type ISearchItem } from "@interfaces/lyric";
import { render, screen, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";

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

// Mock the useFormatting composable
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test("it calls enqueueHandler when item button is clicked", async () => {
    const user = userEvent.setup();

    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResults results={results} enqueueHandler={enqueueFn} />
    ));

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryAllByRole("button").length).toBeGreaterThan(0);
    });

    // Click the add button
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    // Make the assertions.
    expect(enqueueFn).toHaveBeenCalledOnce();
    expect(enqueueFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title,
        content: [[line]],
      })
    );
  });

  test("it renders multiple results correctly", async () => {
    const multipleResults: ISearchItem[] = [
      {
        title: "Song One",
        content: [["Lyrics one"]],
        source: ISource.musix,
        status: IStatus.PUBLISHED,
        sort: null,
      },
      {
        title: "Song Two",
        content: [["Lyrics two"]],
        source: ISource.meili,
        status: IStatus.PUBLISHED,
        sort: null,
      },
      {
        title: "Song Three",
        content: [["Lyrics three"]],
        source: ISource.musix,
        status: IStatus.PUBLISHED,
        sort: null,
      },
    ];

    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResults
        results={multipleResults}
        enqueueHandler={enqueueFn}
      />
    ));

    // Get the list items from the vDOM.
    const items = await screen.findAllByRole("listitem");

    // Make the assertions.
    expect(items).toHaveLength(3);
  });

  test("it renders empty list when no results", () => {
    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResults results={[]} enqueueHandler={enqueueFn} />
    ));

    // Get the component from the vDOM.
    const el = screen.getByRole("list");

    // Make the assertions.
    expect(el).toBeInTheDocument();
    expect(el.children.length).toBe(0);
  });
});
