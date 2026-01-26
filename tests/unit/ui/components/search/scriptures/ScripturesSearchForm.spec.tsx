import ScripturesSearchForm from "@components/search/scriptures/ScripturesSearchForm";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

// Mock the useScriptures composable
vi.mock("@composables/useScriptures", () => ({
  default: () => ({
    loadVersions: vi.fn().mockResolvedValue([]),
    loadBooks: vi.fn().mockResolvedValue([]),
    loadChapters: vi.fn().mockResolvedValue([]),
    loadChapterContent: vi.fn().mockResolvedValue([]),
  }),
}));

describe("<ScripturesSearchForm />", () => {
  // Define the component props.
  const enqueueFn = vi.fn();

  test("it renders correctly", () => {
    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Get the elements from the vDOM.
    const bookEl = screen.getByLabelText("Book");
    const chapterEl = screen.getByLabelText("Chapter");
    const buttonEl = screen.getByRole("button");

    expect(bookEl).toBeInTheDocument();
    expect(bookEl).toHaveValue("Choose a book");

    expect(chapterEl).toBeInTheDocument();
    expect(chapterEl).toHaveValue("Choose a chapter");

    expect(buttonEl).toBeDisabled();
  });

  test("it displays the submit button with correct text", () => {
    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Get the button from the vDOM.
    const buttonEl = screen.getByRole("button");

    // Make the assertions.
    expect(buttonEl).toHaveTextContent("Add to queue");
  });
});
