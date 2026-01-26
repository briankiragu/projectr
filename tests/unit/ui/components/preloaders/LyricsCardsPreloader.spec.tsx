import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, beforeEach, vi } from "vitest";

describe("<LyricsCardPreloader />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it renders correctly when the browser can project", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={true} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");
    const heading = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(img).toHaveAttribute("src", "/images/waiting.webp");
    expect(heading).toHaveTextContent("Waiting for content to be queued...");
  });

  test("it renders correctly when the browser cannot project", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={false} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");
    const heading = screen.getByRole("heading");

    // Assert that the data is correct.
    expect(img).toHaveAttribute("src", "/images/failed.webp");
    expect(heading).toHaveTextContent("Failed to identify a second screen.");
  });

  test("it has the correct fallback alt text for failed image", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={false} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");

    // Assert that the alt text is correct.
    expect(img).toHaveAttribute("alt", "Failed to identify second screen");
  });

  test("it has the correct alt text for waiting image", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCardsPreloader canProject={true} />);

    // Get the element from the vDOM.
    const img = screen.getByRole("img");

    // Assert that the alt text is correct.
    expect(img).toHaveAttribute("alt", "No items in queue");
  });
});
