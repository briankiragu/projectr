import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

describe("<LyricsCardPreloader />", () => {
  test("it renders correctly", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader />);

    // Get the element from the vDOM.
    const el = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(el).toHaveTextContent("No track is currently playing");
  });
});
