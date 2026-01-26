import ScripturesSearchForm from "@components/search/scriptures/ScripturesSearchForm";
import { render, screen, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock data
const mockVersions = [
  {
    id: "v1",
    abbreviationLocal: "KJV",
    nameLocal: "King James Version",
    descriptionLocal: "Authorized Version",
  },
];

const mockBooks = [
  { id: "GEN", name: "Genesis" },
  { id: "EXO", name: "Exodus" },
];

const mockChapters = [
  { id: "GEN.1", number: "1" },
  { id: "GEN.2", number: "2" },
];

const mockContent = [
  { reference: "Genesis 1:1", content: "In the beginning God created" },
  { reference: "Genesis 1:2", content: "And the earth was without form" },
];

// Mock the useScriptures composable
vi.mock("@composables/useScriptures", () => ({
  default: () => ({
    loadVersions: vi.fn().mockResolvedValue(mockVersions),
    loadBooks: vi.fn().mockResolvedValue(mockBooks),
    loadChapters: vi.fn().mockResolvedValue(mockChapters),
    loadChapterContent: vi.fn().mockResolvedValue(mockContent),
  }),
}));

describe("<ScripturesSearchForm />", () => {
  // Define the component props.
  const enqueueFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test("it loads versions on mount", async () => {
    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Wait for versions to load
    await waitFor(() => {
      const versionSelect = screen.getAllByRole("combobox")[0];
      expect(versionSelect.querySelectorAll("option").length).toBeGreaterThan(1);
    });
  });

  test("it loads books when version is selected", async () => {
    const user = userEvent.setup();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Wait for versions to load
    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox")[0].querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });

    // Select a version
    const versionSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(versionSelect, "v1");

    // Wait for books to load
    await waitFor(() => {
      const bookSelect = screen.getByLabelText("Book");
      expect(bookSelect.querySelectorAll("option").length).toBeGreaterThan(1);
    });
  });

  test("it loads chapters when book is selected", async () => {
    const user = userEvent.setup();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Wait for versions and select one
    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox")[0].querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getAllByRole("combobox")[0], "v1");

    // Wait for books and select one
    await waitFor(() => {
      expect(
        screen.getByLabelText("Book").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Book"), "GEN");

    // Wait for chapters to load
    await waitFor(() => {
      const chapterSelect = screen.getByLabelText("Chapter");
      expect(chapterSelect.querySelectorAll("option").length).toBeGreaterThan(1);
    });
  });

  test("it enables button when chapter content is loaded", async () => {
    const user = userEvent.setup();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Go through the full selection flow
    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox")[0].querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getAllByRole("combobox")[0], "v1");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Book").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Book"), "GEN");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Chapter").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Chapter"), "GEN.1");

    // Wait for content to load and button to enable
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  test("it displays verse count when content is loaded", async () => {
    const user = userEvent.setup();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Go through the full selection flow
    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox")[0].querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getAllByRole("combobox")[0], "v1");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Book").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Book"), "GEN");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Chapter").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Chapter"), "GEN.1");

    // Wait for verse count to appear
    await waitFor(() => {
      expect(screen.getByText("2 verses loaded")).toBeInTheDocument();
    });
  });

  test("it calls enqueueHandler with correct data on submit", async () => {
    const user = userEvent.setup();

    // Render the element on the vDOM.
    render(() => <ScripturesSearchForm enqueueHandler={enqueueFn} />);

    // Go through the full selection flow
    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox")[0].querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getAllByRole("combobox")[0], "v1");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Book").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Book"), "GEN");

    await waitFor(() => {
      expect(
        screen.getByLabelText("Chapter").querySelectorAll("option").length
      ).toBeGreaterThan(1);
    });
    await user.selectOptions(screen.getByLabelText("Chapter"), "GEN.1");

    // Wait for button to enable
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    // Submit the form
    await user.click(screen.getByRole("button"));

    // Check that enqueueHandler was called with correct structure
    expect(enqueueFn).toHaveBeenCalledOnce();
    expect(enqueueFn).toHaveBeenCalledWith(
      expect.objectContaining({
        qid: expect.any(Number),
        title: expect.any(String),
        content: expect.any(Array),
      })
    );
  });
});
