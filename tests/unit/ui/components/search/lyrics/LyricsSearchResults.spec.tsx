import LyricsSearchResults from "@components/search/lyrics/LyricsSearchResults";
import { ISource, IStatus, type ISearchItem } from "@interfaces/track";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

describe("<LyricsSearchResultsItem />", () => {
  // Define the component props.
  const title = "ThIs IS-tHe-tItLe";
  const line = "This is a line";
  const results: ISearchItem[] = [
    {
      title,
      lyrics: [[line]],
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

  test.todo("it renders the list items");
});
