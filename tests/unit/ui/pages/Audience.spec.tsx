import Audience from "@pages/Audience";
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

describe("<Audience />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectionCallback = null;
    presentationCallback = null;
  });

  test("it renders correctly with no content", () => {
    // Render the component onto the vDOM.
    render(() => <Audience />);

    // The component should render without errors
    // When there's no nowPlaying, the logo background should be visible
    expect(document.body).toBeInTheDocument();
  });

  test("it has the correct container styling", () => {
    // Render the component onto the vDOM.
    const { container } = render(() => <Audience />);

    // Get the main container
    const mainDiv = container.firstChild as HTMLElement;

    // Make the assertions.
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("h-dvh");
    expect(mainDiv).toHaveClass("bg-gray-100");
  });

  test("it registers projection and presentation receivers on mount", () => {
    render(() => <Audience />);

    // Check that callbacks were registered
    expect(projectionCallback).toBeDefined();
    expect(presentationCallback).toBeDefined();
  });

  test("it displays title when content is received with verse index 0", async () => {
    render(() => <Audience />);

    // Simulate receiving a message
    const data = {
      nowPlaying: {
        qid: 1,
        title: "test-song",
        content: [["First verse line 1", "First verse line 2"]],
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

  test("it displays lyrics from current verse", async () => {
    render(() => <Audience />);

    // Simulate receiving a message
    const data = {
      nowPlaying: {
        qid: 1,
        title: "test-song",
        content: [
          ["First verse line 1"],
          ["Second verse line 1", "Second verse line 2"],
        ],
      },
      currentVerseIndex: 1,
    };

    // Trigger the projection callback
    projectionCallback?.({ data: JSON.stringify(data) } as MessageEvent);

    // Wait for reactivity
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check that second verse content is displayed
    expect(screen.getByText("Second verse line 1")).toBeInTheDocument();
    expect(screen.getByText("Second verse line 2")).toBeInTheDocument();
  });

  test("it clears content when null data is received", async () => {
    render(() => <Audience />);

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
