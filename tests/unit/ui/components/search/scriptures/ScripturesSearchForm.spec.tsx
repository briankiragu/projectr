import ScripturesSearchForm from "@components/search/scriptures/ScripturesSearchForm";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("<ScripturesSearchForm />", () => {
  // Define the component props.
  const enqueueFn = vi.fn();

  // Define the user for events.
  const user = userEvent.setup();

  test("it renders correctly", () => {
    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Get the elements from the vDOM.
    const versionEl = screen.getByLabelText("Search for a Bible version...");
    const bookEl = screen.getByLabelText("Book");
    const chapterEl = screen.getByLabelText("Chapter");
    const buttonEl = screen.getByRole("button");

    // Make the assertions.
    expect(versionEl).toBeInTheDocument();
    expect(versionEl).toHaveValue("Loading...");

    expect(bookEl).toBeInTheDocument();
    expect(bookEl).toHaveValue("Choose a book");

    expect(chapterEl).toBeInTheDocument();
    expect(chapterEl).toHaveValue("Choose a chapter");

    expect(buttonEl).toBeDisabled();
  });

  test.todo("it calls the handle when submitted", async () => {
    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Get the elements from the vDOM.
    const buttonEl = screen.getByRole("button");

    // Interact with the vDOM.
    await user.click(buttonEl);

    // Make the assertions.
    expect(enqueueFn).toHaveBeenCalledOnce();
  });
});
