import LyricsSearchResultsItem from "@components/search/lyrics/LyricsSearchResultsItem";
import { ISource, IStatus, type ISearchItem } from "@interfaces/lyric";
import { render, screen, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";

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

describe("<LyricsSearchResultsItem />", () => {
  // Define the component props.
  const title = "ThIs IS-tHe-tItLe";
  const line = "This is a line";
  const track: ISearchItem = {
    title,
    content: [[line]],
    source: ISource.musix,
    status: IStatus.PUBLISHED,
    sort: null,
  };
  const handlerFn = vi.fn();

  // Define the user for events.
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it renders correctly", () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchResultsItem track={track} handler={handlerFn} />);

    // Get the component from the vDOM.
    const listItemEl = screen.getByRole("listitem");
    const imgEl = within(listItemEl).getByRole("img");
    const buttonEl = within(listItemEl).getByRole("button");

    // Make the assertions.
    expect(listItemEl).toHaveTextContent("This Is The Title");
    expect(imgEl).toHaveAttribute("src", "/images/musixmatch-logo.webp");
    expect(buttonEl).toBeInTheDocument();
  });

  test("it calls the handler when clicked", async () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchResultsItem track={track} handler={handlerFn} />);

    // Get the component from the vDOM.
    const el = screen.getByRole("button");

    // Interact with the vDOM.
    await user.click(el);

    // Make the assertions
    expect(handlerFn).toHaveBeenCalledOnce();
  });

  test("it displays artists when present", () => {
    const trackWithArtists: ISearchItem = {
      ...track,
      artists: ["Artist One", "Artist Two"],
    };

    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResultsItem track={trackWithArtists} handler={handlerFn} />
    ));

    // Get the component from the vDOM.
    const listItemEl = screen.getByRole("listitem");

    // Make the assertions.
    expect(listItemEl).toHaveTextContent("Artist One, Artist Two");
  });

  test("it displays first line of content", () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchResultsItem track={track} handler={handlerFn} />);

    // Get the component from the vDOM.
    const listItemEl = screen.getByRole("listitem");

    // Make the assertions.
    expect(listItemEl).toHaveTextContent("This Is A Line");
  });

  test("it shows correct source image for different sources", () => {
    const trackWithDifferentSource: ISearchItem = {
      ...track,
      source: ISource.meili,
    };

    // Render the component in the vDOM.
    render(() => (
      <LyricsSearchResultsItem
        track={trackWithDifferentSource}
        handler={handlerFn}
      />
    ));

    // Get the image from the vDOM.
    const imgEl = screen.getByRole("img");

    // Make the assertions.
    expect(imgEl).toHaveAttribute("src", "/images/meilisearch-logo.webp");
  });
});
