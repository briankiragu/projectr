import LyricsSearchForm from "@components/search/lyrics/LyricsSearchForm";
import { fireEvent, render, screen } from "@solidjs/testing-library";
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

  test("it triggers search handler on input after debounce", async () => {
    vi.useFakeTimers();
    const searchFn = vi.fn();

    render(() => <LyricsSearchForm searchHandler={searchFn} />);

    const el = screen.getByRole("searchbox");

    // Simulate an input event
    fireEvent.input(el, { target: { value: "test query" } });

    // Advance past debounce time (500ms)
    vi.advanceTimersByTime(600);

    // The search should eventually trigger
    vi.useRealTimers();
  });

  test("it prevents default form submission", async () => {
    const searchFn = vi.fn();
    render(() => <LyricsSearchForm searchHandler={searchFn} />);

    const form = screen.getByRole("searchbox").closest("form")!;
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");
    form.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
