import LyricsSearchResultsItem from "@components/search/lyrics/LyricsSearchResultsItem";
import { ISource, IStatus, type ISearchItem } from "@interfaces/track";
import { render, screen, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("<LyricsSearchResultsItem />", () => {
  // Define the component props.
  const title = "ThIs IS-tHe-tItLe";
  const line = "This is a line";
  const track: ISearchItem = {
    title,
    lyrics: [[line]],
    source: ISource.musix,
    status: IStatus.PUBLISHED,
    sort: null,
  };
  const handlerFn = vi.fn();

  // Define the user for events.
  const user = userEvent.setup();

  test("it renders correctly", () => {
    // Render the component in the vDOM.
    render(() => <LyricsSearchResultsItem track={track} handler={handlerFn} />);

    // Get the component from the vDOM.
    const listItemEl = screen.getByRole("listitem");
    const imgEl = within(listItemEl).getByRole("img");
    const buttonEl = within(listItemEl).getByRole("button");

    // Make the assertions.
    expect(listItemEl).toHaveTextContent("This Is The Title");
    expect(imgEl).toHaveAttribute("src", "/images/MusixMatch-logo.webp");
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
});
