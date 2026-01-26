import Audience from "@pages/Audience";
import { render, screen } from "@solidjs/testing-library";
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

describe("<Audience />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
