import LyricsCard from "@components/cards/LyricsCard";
import { cleanup, render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<LyricsCard />", () => {
  // Define the component props.
  const line = "This is a line from a track";
  const fn = vi.fn();

  // Setup the user for events.
  const user = userEvent.setup();

  // Call the cleanup function after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCard isActive={true} verse={[line]} handler={fn} />);

    // Get the element from the vDOM.
    const el = screen.getByTestId("lyrics-card");

    // Assert that the lyrics are displyed.
    expect(el).toHaveTextContent(line);
  });

  test("it calls the handler when clicked", async () => {
    // Render the component onto the vDOM.
    render(() => <LyricsCard isActive={true} verse={[line]} handler={fn} />);

    // Get the element from the vDOM.
    const el = screen.getByTestId("lyrics-card");
    await user.click(el);
    await user.click(el);

    // Assert the expectations.
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
