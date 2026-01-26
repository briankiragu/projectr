import Controller from "@pages/Controller";
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
  addEventListener = vi.fn();
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
    setStoredNowPlaying: vi.fn(),
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
    isConnected: () => false,
    isVisible: () => true,
    openProjection: vi.fn(),
    showProjection: vi.fn(),
    hideProjection: vi.fn(),
    closeProjection: vi.fn(),
    sendProjectionData: vi.fn(),
    initialiseProjectionReceiver: vi.fn(),
  }),
}));

vi.mock("@composables/useQueue", () => ({
  default: () => ({
    queue: [],
    nowPlaying: () => undefined,
    currentVerseIndex: () => 0,
    isEditing: () => false,
    setQueue: vi.fn(),
    setNowPlaying: vi.fn(),
    setCurrentVerseIndex: vi.fn(),
    setIsEditing: vi.fn(),
    peek: () => undefined,
    enqueue: vi.fn(),
    dequeue: vi.fn(),
    flush: vi.fn(),
    isFirstVerse: () => true,
    isLastVerse: () => false,
    goToPreviousVerse: vi.fn(),
    goToNextVerse: vi.fn(),
    goToVerse: vi.fn(),
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

describe("<Controller />", () => {
  beforeEach(() => {
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
});
