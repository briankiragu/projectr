import Prompter from "@pages/Prompter";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Store callback functions for testing
let projectionCallback: ((event: MessageEvent) => void) | null = null;
let presentationCallback: ((event: MessageEvent) => void) | null = null;

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage = vi.fn();
  close = vi.fn();
  addEventListener = vi.fn(
    (event: string, handler: (event: MessageEvent) => void) => {
      if (event === "message") {
        this.onmessage = handler;
      }
    }
  );
  removeEventListener = vi.fn();
}

(global as Record<string, unknown>)["BroadcastChannel"] = MockBroadcastChannel;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock the composables
vi.mock("@composables/useFormatting", () => ({
  default: () => ({
    toTitleCase: (phrase?: string) =>
      phrase
        ? phrase
            .toLowerCase()
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : null,
  }),
}));

vi.mock("@composables/usePresentation", () => ({
  default: () => ({
    initialisePresentationReceiver: vi.fn((callback) => {
      presentationCallback = callback;
    }),
  }),
}));

vi.mock("@composables/useProjection", () => ({
  default: () => ({
    initialiseProjectionReceiver: vi.fn((callback) => {
      projectionCallback = callback;
    }),
  }),
}));

describe("<Prompter />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectionCallback = null;
    presentationCallback = null;
  });

  test("it renders correctly with no content", () => {
    // Render the component onto the vDOM.
    render(() => <Prompter />);

    // The component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  test("it has the correct container styling", () => {
    // Render the component onto the vDOM.
    const { container } = render(() => <Prompter />);

    // Get the main container
    const mainDiv = container.firstChild as HTMLElement;

    // Make the assertions.
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("min-h-dvh");
    expect(mainDiv).toHaveClass("bg-gray-100");
  });

  test("it displays title heading element", () => {
    // Render the component onto the vDOM.
    const { container } = render(() => <Prompter />);

    // Find the h2 element for title
    const titleEl = container.querySelector("h2");

    // Make the assertions.
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveClass("text-wrap");
    expect(titleEl).toHaveClass("uppercase");
  });

  test("it registers projection and presentation receivers on mount", () => {
    render(() => <Prompter />);

    // Check that callbacks were registered
    expect(projectionCallback).toBeDefined();
    expect(presentationCallback).toBeDefined();
  });

  test("it displays title when content is received", async () => {
    render(() => <Prompter />);

    // Simulate receiving a message
    const data = {
      nowPlaying: {
        qid: 1,
        title: "test-song",
        content: [["First verse line 1"]],
      },
      currentVerseIndex: 0,
    };

    // Trigger the projection callback
    projectionCallback?.({ data: JSON.stringify(data) } as MessageEvent);

    // Wait for reactivity
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check that title is displayed
    const title = await screen.findByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Test Song");
  });

  test("it displays all verses from content", async () => {
    render(() => <Prompter />);

    // Simulate receiving a message with multiple verses
    const data = {
      nowPlaying: {
        qid: 1,
        title: "test-song",
        content: [["First verse"], ["Second verse"], ["Third verse"]],
      },
      currentVerseIndex: 1,
    };

    // Trigger the projection callback
    projectionCallback?.({ data: JSON.stringify(data) } as MessageEvent);

    // Wait for reactivity
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check that all verses are displayed
    expect(screen.getByText("First verse")).toBeInTheDocument();
    expect(screen.getByText("Second verse")).toBeInTheDocument();
    expect(screen.getByText("Third verse")).toBeInTheDocument();
  });

  test("it clears content when null data is received", async () => {
    render(() => <Prompter />);

    // First, set some content
    const data = {
      nowPlaying: { qid: 1, title: "test", content: [["Line 1"]] },
      currentVerseIndex: 0,
    };
    projectionCallback?.({ data: JSON.stringify(data) } as MessageEvent);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Now send null
    projectionCallback?.({ data: JSON.stringify(null) } as MessageEvent);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Content should be cleared
    expect(screen.queryByText("Line 1")).not.toBeInTheDocument();
  });
});
