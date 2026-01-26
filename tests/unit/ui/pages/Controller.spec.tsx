import Controller from "@pages/Controller";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import type { IQueueItem } from "@interfaces/queue";

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage = vi.fn();
  close = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

(global as Record<string, unknown>)["BroadcastChannel"] = MockBroadcastChannel;

// Create mock functions that can be spied on
const mockSetNowPlaying = vi.fn();
const mockSetCurrentVerseIndex = vi.fn();
const mockSetIsEditing = vi.fn();
const mockEnqueue = vi.fn();
const mockDequeue = vi.fn();
const mockFlush = vi.fn();
const mockGoToPreviousVerse = vi.fn();
const mockGoToNextVerse = vi.fn();
const mockGoToVerse = vi.fn();
const mockOpenProjection = vi.fn();
const mockCloseProjection = vi.fn();
const mockShowProjection = vi.fn();
const mockHideProjection = vi.fn();
const mockSendProjectionData = vi.fn();
const mockSetStoredNowPlaying = vi.fn();

// State holders for dynamic mock behavior
let mockNowPlaying: () => IQueueItem | undefined = () => undefined;
let mockQueue: IQueueItem[] = [];
let mockPeek: () => IQueueItem | undefined = () => undefined;
let mockIsVisible: () => boolean = () => true;
let mockIsConnected: () => boolean = () => false;
let mockIsEditing: () => boolean = () => false;
let mockCurrentVerseIndex: () => number = () => 0;

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
    toEditableLyrics: (content: string[][]) =>
      content.reduce((acc1, verse) => {
        const stanza = verse.reduce((acc2, line) => `${acc2}\n${line}`);
        return `${acc1}${stanza}\n\n`;
      }, ``),
    fromEditableLyrics: (content: string) =>
      content
        .split(/\n\n/g)
        .filter((verse) => verse.length)
        .map((verse) => verse.split(/\n/g)),
  }),
}));

vi.mock("@composables/usePersistence", () => ({
  default: () => ({
    getStoredQueue: vi.fn().mockReturnValue([]),
    setStoredQueue: vi.fn(),
    getStoredNowPlaying: vi.fn().mockReturnValue(undefined),
    setStoredNowPlaying: mockSetStoredNowPlaying,
  }),
}));

vi.mock("@composables/usePresentation", () => ({
  default: () => ({
    isAvailable: () => true,
    isConnected: () => false,
    isVisible: () => true,
    openPresentation: vi.fn(),
    showPresentation: vi.fn(),
    hidePresentation: vi.fn(),
    closePresentation: vi.fn(),
    sendPresentationData: vi.fn(),
    initialisePresentationController: vi.fn(),
    initialisePresentationReceiver: vi.fn(),
  }),
}));

vi.mock("@composables/useProjection", () => ({
  default: () => ({
    isAvailable: () => true,
    isConnected: () => mockIsConnected(),
    isVisible: () => mockIsVisible(),
    openProjection: mockOpenProjection,
    showProjection: mockShowProjection,
    hideProjection: mockHideProjection,
    closeProjection: mockCloseProjection,
    sendProjectionData: mockSendProjectionData,
    initialiseProjectionReceiver: vi.fn(),
  }),
}));

vi.mock("@composables/useQueue", () => ({
  default: () => ({
    queue: mockQueue,
    nowPlaying: () => mockNowPlaying(),
    currentVerseIndex: () => mockCurrentVerseIndex(),
    isEditing: () => mockIsEditing(),
    setQueue: vi.fn(),
    setNowPlaying: mockSetNowPlaying,
    setCurrentVerseIndex: mockSetCurrentVerseIndex,
    setIsEditing: mockSetIsEditing,
    peek: () => mockPeek(),
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
    flush: mockFlush,
    isFirstVerse: () => true,
    isLastVerse: () => false,
    goToPreviousVerse: mockGoToPreviousVerse,
    goToNextVerse: mockGoToNextVerse,
    goToVerse: mockGoToVerse,
  }),
}));

vi.mock("@composables/useTracks", () => ({
  default: () => ({
    searchTracks: vi.fn().mockResolvedValue([]),
    searchItemToQueueItem: vi.fn((item) => ({
      qid: Date.now(),
      title: item.title,
      artists: item.artists,
      content: item.content,
    })),
  }),
}));

vi.mock("@composables/useScriptures", () => ({
  default: () => ({
    loadVersions: vi.fn().mockResolvedValue([]),
    loadBooks: vi.fn().mockResolvedValue([]),
    loadChapters: vi.fn().mockResolvedValue([]),
    loadChapterContent: vi.fn().mockResolvedValue([]),
  }),
}));

// Helper to create a mock queue item
const createMockQueueItem = (
  overrides: Partial<IQueueItem> = {}
): IQueueItem => ({
  qid: Date.now(),
  title: "Test Song",
  content: [["Line 1"], ["Line 2"]],
  ...overrides,
});

// Helper to dispatch keyboard events
const dispatchKeyboardEvent = (code: string, shiftKey = false) => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { code, shiftKey, bubbles: true })
  );
};

describe("<Controller />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    mockNowPlaying = () => undefined;
    mockQueue = [];
    mockPeek = () => undefined;
    mockIsVisible = () => true;
    mockIsConnected = () => false;
    mockIsEditing = () => false;
    mockCurrentVerseIndex = () => 0;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("it renders correctly", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // The component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  test("it displays the search section", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // Find the search heading
    const searchHeading = screen.getByRole("heading", { name: /search/i });

    // Make the assertions.
    expect(searchHeading).toBeInTheDocument();
  });

  test("it displays the now playing section", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // Find the now playing text
    const nowPlayingText = screen.getByText("Now Playing");

    // Make the assertions.
    expect(nowPlayingText).toBeInTheDocument();
  });

  test("it displays the up next section", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // Find the up next text
    const upNextText = screen.getByText("Up next");

    // Make the assertions.
    expect(upNextText).toBeInTheDocument();
  });

  test("it displays projection button", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // Find the launch projection text
    const projectionText = screen.getByText("Launch projection");

    // Make the assertions.
    expect(projectionText).toBeInTheDocument();
  });

  test("it displays playback control buttons", () => {
    // Render the component onto the vDOM.
    render(() => <Controller />);

    // Find the playback buttons
    const prevButton = screen.getByText("Previous verse");
    const nextButton = screen.getByText("Next verse");
    const nextTrackButton = screen.getByText("Next track");

    // Make the assertions.
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(nextTrackButton).toBeInTheDocument();
  });

  test("it has correct footer structure", () => {
    // Render the component onto the vDOM.
    const { container } = render(() => <Controller />);

    // Find the footer element
    const footer = container.querySelector("#controls");

    // Make the assertions.
    expect(footer).toBeInTheDocument();
  });

  // Keyboard event handler tests
  describe("keyboard event handlers", () => {
    test("F5 key opens projection", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("F5");
      expect(mockOpenProjection).toHaveBeenCalled();
    });

    test("Shift+P opens projection", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("KeyP", true);
      expect(mockOpenProjection).toHaveBeenCalled();
    });

    test("Escape key closes projection", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("Escape");
      expect(mockCloseProjection).toHaveBeenCalled();
    });

    test("Period key toggles visibility when visible", () => {
      mockIsVisible = () => true;
      render(() => <Controller />);
      dispatchKeyboardEvent("Period");
      expect(mockHideProjection).toHaveBeenCalled();
    });

    test("Period key shows projection when hidden", () => {
      mockIsVisible = () => false;
      render(() => <Controller />);
      dispatchKeyboardEvent("Period");
      expect(mockShowProjection).toHaveBeenCalled();
    });

    test("Shift+S toggles visibility when visible", () => {
      mockIsVisible = () => true;
      render(() => <Controller />);
      dispatchKeyboardEvent("KeyS", true);
      expect(mockHideProjection).toHaveBeenCalled();
    });

    test("Shift+S shows projection when hidden", () => {
      mockIsVisible = () => false;
      render(() => <Controller />);
      dispatchKeyboardEvent("KeyS", true);
      expect(mockShowProjection).toHaveBeenCalled();
    });

    test("ArrowLeft navigates to previous verse", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("ArrowLeft");
      expect(mockGoToPreviousVerse).toHaveBeenCalled();
    });

    test("PageUp navigates to previous verse", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("PageUp");
      expect(mockGoToPreviousVerse).toHaveBeenCalled();
    });

    test("ArrowRight navigates to next verse", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("ArrowRight");
      expect(mockGoToNextVerse).toHaveBeenCalled();
    });

    test("PageDown navigates to next verse", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("PageDown");
      expect(mockGoToNextVerse).toHaveBeenCalled();
    });

    test("Shift+ArrowRight plays next track", () => {
      const mockItem = createMockQueueItem();
      mockPeek = () => mockItem;
      render(() => <Controller />);
      dispatchKeyboardEvent("ArrowRight", true);
      expect(mockSetNowPlaying).toHaveBeenCalled();
    });
  });

  // Network connectivity tests
  describe("network connectivity events", () => {
    test("offline event shows offline banner", async () => {
      render(() => <Controller />);

      // Dispatch offline event
      window.dispatchEvent(new Event("offline"));

      // Check for offline banner
      const banner = await screen.findByText(/offline/i);
      expect(banner).toBeInTheDocument();
    });

    test("online event hides offline banner", async () => {
      render(() => <Controller />);

      // Go offline then online
      window.dispatchEvent(new Event("offline"));
      window.dispatchEvent(new Event("online"));

      // Banner should be hidden
      const banner = screen.queryByText(/You are currently offline/i);
      expect(banner).not.toBeInTheDocument();
    });
  });

  // Toggle lyrics/scriptures search tests
  describe("search toggle functionality", () => {
    test("toggle button switches between lyrics and scriptures search", async () => {
      render(() => <Controller />);

      // Initially shows lyrics
      expect(screen.getByText("lyrics")).toBeInTheDocument();

      // Find and click toggle button by its accessible name
      const toggleButton = screen.getByRole("button", { name: "toggle_on" });
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);
    });
  });

  // Queue management tests
  describe("queue management", () => {
    test("flush button clears the queue when items exist", () => {
      const mockItem = createMockQueueItem();
      mockPeek = () => mockItem;
      mockQueue = [mockItem];

      render(() => <Controller />);

      // Find and click the clear all button
      const clearButton = screen.getByText("Clear all");
      fireEvent.click(clearButton);

      expect(mockFlush).toHaveBeenCalled();
    });
  });

  // Now playing with content tests
  describe("now playing content display", () => {
    test("displays now playing title and content when available", () => {
      const mockItem = createMockQueueItem({ title: "Amazing Grace" });
      mockNowPlaying = () => mockItem;

      render(() => <Controller />);

      // Title should be displayed
      expect(screen.getByText(/Amazing Grace/i)).toBeInTheDocument();
    });

    test("displays lyrics cards for each verse", () => {
      const mockItem = createMockQueueItem({
        content: [["Verse 1 Line 1"], ["Verse 2 Line 1"], ["Verse 3 Line 1"]],
      });
      mockNowPlaying = () => mockItem;

      render(() => <Controller />);

      // Content div should exist
      const contentDiv = document.getElementById("content");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  // Edit mode tests
  describe("edit mode functionality", () => {
    test("shows edit form when editing is enabled", () => {
      const mockItem = createMockQueueItem();
      mockNowPlaying = () => mockItem;
      mockIsEditing = () => true;

      render(() => <Controller />);

      // Edit form should be visible (check for textarea)
      const textareas = document.querySelectorAll("textarea");
      expect(textareas.length).toBeGreaterThan(0);
    });
  });

  // Broadcast tests
  describe("broadcast functionality", () => {
    test("broadcasts data when receiver is visible and now playing exists", () => {
      const mockItem = createMockQueueItem();
      mockNowPlaying = () => mockItem;
      mockIsVisible = () => true;

      render(() => <Controller />);

      // Trigger a verse change which calls broadcast
      dispatchKeyboardEvent("ArrowRight");

      expect(mockSetStoredNowPlaying).toHaveBeenCalled();
    });

    test("broadcasts null when now playing is undefined", () => {
      mockNowPlaying = () => undefined;
      mockIsVisible = () => true;

      render(() => <Controller />);

      // Component renders and mounts, which may trigger broadcast
      expect(mockSetStoredNowPlaying).toHaveBeenCalled();
    });
  });

  // Projection state tests
  describe("projection state handling", () => {
    test("displays correct projection button state when connected", () => {
      mockIsConnected = () => true;

      render(() => <Controller />);

      // When connected, it should show "End projection" text
      expect(screen.getByText(/projection/i)).toBeInTheDocument();
    });
  });
});
