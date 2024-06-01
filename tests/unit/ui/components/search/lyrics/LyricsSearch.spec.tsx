import LyricsSearch from "@components/search/lyrics/LyricsSearch";
import type { ISearchItem } from "@interfaces/lyric";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

describe("<LyricsSearch />", () => {
  // Define the component props.
  const results: ISearchItem[] = [];
  const searchFn = vi.fn();
  const enqueueFn = vi.fn();

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
});
