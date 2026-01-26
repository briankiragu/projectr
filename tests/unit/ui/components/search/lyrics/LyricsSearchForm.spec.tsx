import LyricsSearchForm from "@components/search/lyrics/LyricsSearchForm";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

// Mock the useTracks composable
vi.mock("@composables/useTracks", () => ({
  default: () => ({
    searchTracks: vi.fn().mockResolvedValue([]),
  }),
}));

describe("<LyricsSearchForm />", () => {
  // Define the component props.
  const searchFn = vi.fn();

  test("it renders correctly", () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchForm searchHandler={searchFn} />);

    // Get the element from the vDOM.
    const el = screen.getByRole("searchbox");

    // Make the assertion.
    expect(el).toHaveAttribute(
      "placeholder",
      "Search for a track by title or content..."
    );
  });

  test("it has autofocus on the search input", () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchForm searchHandler={searchFn} />);

    // Get the element from the vDOM.
    const el = screen.getByRole("searchbox");

    // Make the assertion.
    expect(el).toHaveAttribute("autofocus");
  });
});
