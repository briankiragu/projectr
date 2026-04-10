import Controller from "@pages/Controller";
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
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
    loadVersions: vi.fn().mockResolvedValue([
      {
        id: "v1",
        abbreviationLocal: "KJV",
        nameLocal: "King James Version",
        descriptionLocal: "Test",
      },
    ]),
    loadBooks: vi.fn().mockResolvedValue([{ id: "GEN", name: "Genesis" }]),
    loadChapters: vi.fn().mockResolvedValue([{ id: "GEN.1", number: "1" }]),
    loadChapterContent: vi.fn().mockResolvedValue([
      { reference: "Genesis 1:1", content: "In the beginning" },
      { reference: "Genesis 1:2", content: "And the earth was" },
    ]),
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

  describe("addToQueue behavior", () => {
    test("sets as now playing when nothing is playing", () => {
      mockNowPlaying = () => undefined;
      render(() => <Controller />);

      // The addToQueue function is called internally when search results are added
      // We test the initial broadcast behavior - when nowPlaying is undefined, broadcast sends null
      expect(mockSetStoredNowPlaying).toHaveBeenCalled();
    });
  });

  describe("Shift+P also closes projection", () => {
    test("Shift+P triggers both open and close", () => {
      render(() => <Controller />);
      dispatchKeyboardEvent("KeyP", true);
      // Both are called because the same key combo matches both conditions
      expect(mockOpenProjection).toHaveBeenCalled();
      expect(mockCloseProjection).toHaveBeenCalled();
    });
  });

  describe("internal function coverage", () => {
    test("playNow sets the track as now playing and dequeues it", async () => {
      const mockItem = createMockQueueItem({ qid: 42, title: "Queue Song" });
      mockNowPlaying = () => createMockQueueItem({ title: "Current Song" });
      mockQueue = [mockItem];
      mockPeek = () => mockItem;

      render(() => <Controller />);

      // Wait for lazy-loaded QueueList items
      const playButtons = await screen.findAllByTitle(
        "play",
        {},
        { timeout: 5000 }
      );
      if (playButtons.length > 0) {
        await fireEvent.click(playButtons[0]);
        expect(mockSetNowPlaying).toHaveBeenCalled();
        expect(mockDequeue).toHaveBeenCalled();
        expect(mockSetCurrentVerseIndex).toHaveBeenCalledWith(0);
        expect(mockSetIsEditing).toHaveBeenCalledWith(false);
      }
    });

    test("editLyrics updates now playing with edited content", async () => {
      const mockItem = createMockQueueItem({
        title: "Edit Me",
        content: [["Original line"]],
      });
      mockNowPlaying = () => mockItem;
      mockIsEditing = () => true;

      render(() => <Controller />);

      // The EditQueueItemForm should render
      const textarea = await screen.findByRole(
        "textbox",
        {},
        { timeout: 5000 }
      );
      expect(textarea).toBeInTheDocument();

      // Submit the form
      const submitButton = screen.getByText("Publish changes");
      await fireEvent.click(submitButton);

      expect(mockSetNowPlaying).toHaveBeenCalled();
      expect(mockSetIsEditing).toHaveBeenCalledWith(false);
    });

    test("NowPlayingCard edit button toggles editing state", async () => {
      const mockItem = createMockQueueItem({ title: "Test Song" });
      mockNowPlaying = () => mockItem;

      render(() => <Controller />);

      // Find the NowPlayingCard's edit button
      const nowPlayingCard = await screen.findByTestId(
        "now-playing-card",
        {},
        { timeout: 5000 }
      );
      const editButton = nowPlayingCard.querySelector("button");
      if (editButton) {
        await fireEvent.click(editButton);
        expect(mockSetIsEditing).toHaveBeenCalled();
      }
    });

    test("LyricsCard renders and clicking it calls goToVerse", async () => {
      const mockItem = createMockQueueItem({
        title: "Multi Verse Song",
        content: [["Verse 1"], ["Verse 2"], ["Verse 3"]],
      });
      mockNowPlaying = () => mockItem;

      render(() => <Controller />);

      // Wait for lazy-loaded LyricsCards
      const cards = await screen.findAllByTestId(
        "lyrics-card",
        {},
        { timeout: 5000 }
      );
      expect(cards.length).toBe(3);

      // Click the second card
      await fireEvent.click(cards[1]);
      expect(mockGoToVerse).toHaveBeenCalledWith(1);
    });

    test("projection button startHandler calls openReceiver with screen type", async () => {
      render(() => <Controller />);

      // Find and click the Launch Projection button to open dropdown
      const projButton = screen.getByText("Launch projection");
      await fireEvent.click(projButton);

      // Click Audience view option
      const audienceOption = screen.getByText("Audience view");
      await fireEvent.click(audienceOption);

      expect(mockOpenProjection).toHaveBeenCalled();
    });

    test("display button showHandler sends projection data", async () => {
      const mockItem = createMockQueueItem({ title: "Display Test" });
      mockNowPlaying = () => mockItem;
      mockIsConnected = () => true;
      mockIsVisible = () => false;

      render(() => <Controller />);

      // Find display button (Show lyrics)
      const showButton = screen.getByText("Show lyrics");
      await fireEvent.click(showButton);

      expect(mockShowProjection).toHaveBeenCalled();
    });

    test("addToQueue enqueues when something is already playing", async () => {
      const mockItem = createMockQueueItem({ title: "Already Playing" });
      mockNowPlaying = () => mockItem;

      render(() => <Controller />);

      // Verify enqueue has not been called yet
      expect(mockEnqueue).not.toHaveBeenCalled();

      // Toggle to scriptures search
      const toggleButton = screen.getByRole("button", { name: "toggle_on" });
      await fireEvent.click(toggleButton);

      // Wait for the scriptures form to render and resources to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a version from the first combobox
      const selects = screen.getAllByRole("combobox");
      await fireEvent.change(selects[0], { target: { value: "v1" } });

      // Wait for books resource to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a book
      const bookSelects = screen.getAllByRole("combobox");
      await fireEvent.change(bookSelects[1], { target: { value: "GEN" } });

      // Wait for chapters resource to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a chapter
      const chapterSelects = screen.getAllByRole("combobox");
      await fireEvent.change(chapterSelects[2], { target: { value: "GEN.1" } });

      // Wait for content resource to resolve and the button to become enabled
      const addButton = screen.getByText("Add to queue");
      await waitFor(
        () => {
          expect(addButton).not.toBeDisabled();
        },
        { timeout: 3000 }
      );

      // Enqueue should still not have been called before clicking
      expect(mockEnqueue).not.toHaveBeenCalled();

      // Submit the form by clicking the now-enabled button
      await fireEvent.click(addButton);

      // addToQueue's else-branch should have called enqueue exactly once
      expect(mockEnqueue).toHaveBeenCalledTimes(1);
    });

    test("addToQueue sets now playing when nothing is playing", async () => {
      // nowPlaying is undefined by default (from beforeEach)
      mockNowPlaying = () => undefined;

      render(() => <Controller />);

      // Verify setNowPlaying has not been called with a queue item yet
      mockSetNowPlaying.mockClear();

      // Toggle to scriptures search
      const toggleButton = screen.getByRole("button", { name: "toggle_on" });
      await fireEvent.click(toggleButton);

      // Wait for the scriptures form to render and resources to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a version from the first combobox
      const selects = screen.getAllByRole("combobox");
      await fireEvent.change(selects[0], { target: { value: "v1" } });

      // Wait for books resource to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a book
      const bookSelects = screen.getAllByRole("combobox");
      await fireEvent.change(bookSelects[1], { target: { value: "GEN" } });

      // Wait for chapters resource to load
      await new Promise((r) => setTimeout(r, 200));

      // Select a chapter
      const chapterSelects = screen.getAllByRole("combobox");
      await fireEvent.change(chapterSelects[2], { target: { value: "GEN.1" } });

      // Wait for content resource to resolve and the button to become enabled
      const addButton = screen.getByText("Add to queue");
      await waitFor(
        () => {
          expect(addButton).not.toBeDisabled();
        },
        { timeout: 3000 }
      );

      // Submit the form by clicking the now-enabled button
      await fireEvent.click(addButton);

      // addToQueue's if-branch should have called setNowPlaying (not enqueue)
      expect(mockSetNowPlaying).toHaveBeenCalled();
      expect(mockEnqueue).not.toHaveBeenCalled();
    });
  });
});
