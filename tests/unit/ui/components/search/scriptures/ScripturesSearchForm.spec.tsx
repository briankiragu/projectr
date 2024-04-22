import ScripturesSearchForm from "@components/search/scriptures/ScripturesSearchForm";
import { render, screen, within } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

describe("<ScripturesSearchForm />", () => {
  test("it renders correctly", () => {
    // Define the component props.
    const enqueueFn = vi.fn();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Get the elements from the vDOM.
    const versionEl = screen.getByLabelText("Search for a Bible version...");
    const bookEl = screen.getByLabelText("Book");
    const chapterEl = screen.getByLabelText("Chapter");

    // Make the assertions.
    expect(versionEl).toBeInTheDocument();
    expect(versionEl).toHaveValue("Loading...");

    expect(bookEl).toBeInTheDocument();
    expect(bookEl).toHaveValue("Choose a book");

    expect(chapterEl).toBeInTheDocument();
    expect(chapterEl).toHaveValue("Choose a chapter");
  });
});
