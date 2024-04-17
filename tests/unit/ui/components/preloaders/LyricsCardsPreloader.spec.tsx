import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";

describe("<LyricsCardPreloader />", () => {
  // Clean up after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader />);

    // Get the element from the vDOM.
    const el = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(el).toHaveTextContent("No track is currently playing");
  });
});
