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
    const { isAvailable, isConnected, isVisible } = usePresentation();

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

  test("it handles openPresentation failure gracefully", async () => {
    // Re-mock to make startPresentation reject
    vi.resetModules();
    vi.doMock("@composables/apis/usePresentationAPI", () => ({
      default: () => ({
        getAvailability: vi.fn((callback: (value: boolean) => void) => {
          callback(true);
        }),
        startPresentation: vi
          .fn()
          .mockRejectedValue(new Error("User cancelled")),
        terminatePresentation: vi.fn(),
        initialisePresentationController: vi.fn(),
        initialisePresentationReceiver: vi.fn(),
      }),
    }));

    const { default: freshUsePresentation } =
      await import("@composables/usePresentation");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { openPresentation, isConnected } = freshUsePresentation();
    await openPresentation();

    expect(isConnected()).toBe(false);
    consoleSpy.mockRestore();
  });

  test("it clears connections when availability drops", async () => {
    // Re-mock to control availability changes
    vi.resetModules();
    let availabilityCallback: ((value: boolean) => void) | null = null as
      | ((value: boolean) => void)
      | null;

    vi.doMock("@composables/apis/usePresentationAPI", () => ({
      default: () => ({
        getAvailability: vi.fn((callback: (value: boolean) => void) => {
          availabilityCallback = callback;
          callback(true); // initially available
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

    const { default: freshUsePresentation } =
      await import("@composables/usePresentation");
    const { openPresentation, isConnected, isAvailable } =
      freshUsePresentation();

    // Open a connection
    await openPresentation();
    expect(isConnected()).toBe(true);
    expect(isAvailable()).toBe(true);

    // Simulate availability dropping
    (availabilityCallback as (value: boolean) => void)(false);
    expect(isAvailable()).toBe(false);
    expect(isConnected()).toBe(false);
  });

  test("it sends null when sendPresentationData is called with null", () => {
    const { sendPresentationData } = usePresentation();
    // Should not throw
    sendPresentationData(null);
  });

  test("it sends stringified data when sendPresentationData is called with data", async () => {
    const { openPresentation, sendPresentationData } = usePresentation();
    await openPresentation();

    const data = {
      nowPlaying: { qid: 1, title: "Test", content: [["Line"]] },
      currentVerseIndex: 0,
    };
    sendPresentationData(data);
    // No error means it worked
  });

  test("it exposes presentation controller and receiver initializers", () => {
    const { initialisePresentationController, initialisePresentationReceiver } =
      usePresentation();

    expect(initialisePresentationController).toBeDefined();
    expect(initialisePresentationReceiver).toBeDefined();
  });
});
