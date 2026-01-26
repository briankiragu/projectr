import { describe, expect, test, vi, beforeEach } from "vitest";
import usePresentation from "@composables/usePresentation";
import type { IProjectionPayload } from "@interfaces/projection";
import { IProjectionScreenTypes } from "@interfaces/projection";

// Mock the usePresentationAPI composable
vi.mock("@composables/apis/usePresentationAPI", () => ({
  default: () => ({
    getAvailability: vi.fn((callback: (value: boolean) => void) => {
      callback(true);
    }),
    startPresentation: vi.fn().mockResolvedValue({
      send: vi.fn(),
      close: vi.fn(),
      terminate: vi.fn(),
    }),
    terminatePresentation: vi.fn(),
    initialisePresentationController: vi.fn(),
    initialisePresentationReceiver: vi.fn(),
  }),
}));

describe("usePresentation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it initializes with availability", () => {
    const {
      isAvailable,
      isConnected,
      isVisible,
    } = usePresentation();

    // Initially should check availability
    expect(isAvailable()).toBe(true);
    expect(isConnected()).toBe(false);
    expect(isVisible()).toBe(true);
  });

  test("it can open a presentation", async () => {
    const { openPresentation, isConnected } = usePresentation();

    // Open a presentation
    await openPresentation();

    // Should now be connected
    expect(isConnected()).toBe(true);
  });

  test("it can open a presentation with a specific screen type", async () => {
    const { openPresentation, isConnected } = usePresentation();

    // Open a presentation with prompter type
    await openPresentation(IProjectionScreenTypes.prompter);

    // Should now be connected
    expect(isConnected()).toBe(true);
  });

  test("it can show the presentation", () => {
    const { showPresentation, isVisible } = usePresentation();

    const data: IProjectionPayload = {
      currentVerseIndex: 0,
      nowPlaying: {
        qid: Date.now(),
        title: "Test Title",
        content: [["Test line"]],
      },
    };

    showPresentation(data);
    expect(isVisible()).toBe(true);
  });

  test("it can hide the presentation", () => {
    const { hidePresentation, isVisible } = usePresentation();

    hidePresentation();
    expect(isVisible()).toBe(false);
  });

  test("it can close the presentation", async () => {
    const { openPresentation, closePresentation, isConnected, isVisible } =
      usePresentation();

    // Open and then close
    await openPresentation();
    expect(isConnected()).toBe(true);

    closePresentation();
    expect(isConnected()).toBe(false);
    expect(isVisible()).toBe(true);
  });

  test("it exposes presentation controller and receiver initializers", () => {
    const {
      initialisePresentationController,
      initialisePresentationReceiver,
    } = usePresentation();

    expect(initialisePresentationController).toBeDefined();
    expect(initialisePresentationReceiver).toBeDefined();
  });
});
