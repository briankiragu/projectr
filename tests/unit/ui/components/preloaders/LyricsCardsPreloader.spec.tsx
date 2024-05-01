import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

describe("<LyricsCardPreloader />", () => {
  test("it renders correctly when the browser can project", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={true} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");
    const heading = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(img).toHaveAttribute("src", "/images/waiting.png");
    expect(heading).toHaveTextContent("No track is currently playing");
  });

  test("it renders correctly when the browser cannot project", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={false} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");
    const heading = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(img).toHaveAttribute("src", "/images/failed.png");
    expect(heading).toHaveTextContent(
      "Failed to identify/project onto a second screen."
    );
  });
});
