import Prompter from "@pages/Prompter";
import { render } from "@solidjs/testing-library";
import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage = vi.fn();
  close = vi.fn();
  addEventListener = vi.fn((event: string, handler: (event: MessageEvent) => void) => {
    if (event === "message") {
      this.onmessage = handler;
    }
  });
  removeEventListener = vi.fn();
}

(global as Record<string, unknown>).BroadcastChannel = MockBroadcastChannel;

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
    initialisePresentationReceiver: vi.fn(),
  }),
}));

vi.mock("@composables/useProjection", () => ({
  default: () => ({
    initialiseProjectionReceiver: vi.fn(),
  }),
}));

describe("<Prompter />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
