import useProjection from "@composables/useProjection";
import type { IProjectionPayload } from "@interfaces/projection";
import { IProjectionScreenTypes } from "@interfaces/projection";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock the useWindowManagementAPI composable
vi.mock("@composables/apis/useWindowManagementAPI", () => ({
  default: () => ({
    isAvailable: () => true,
    project: vi.fn().mockResolvedValue({
      proxy: { close: vi.fn() },
    }),
  }),
}));

describe("useProjection", () => {
  let mockBroadcastChannel: BroadcastChannel;
  let mockPostMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBroadcastChannel = new BroadcastChannel("testing");
    mockPostMessage = vi.spyOn(mockBroadcastChannel, "postMessage") as unknown as ReturnType<typeof vi.fn>;
  });

  test("it returns all required methods and signals", () => {
    const projection = useProjection(mockBroadcastChannel);

    expect(projection.isAvailable).toBeDefined();
    expect(projection.isConnected).toBeDefined();
    expect(projection.isVisible).toBeDefined();
    expect(projection.openProjection).toBeDefined();
    expect(projection.showProjection).toBeDefined();
    expect(projection.hideProjection).toBeDefined();
    expect(projection.closeProjection).toBeDefined();
    expect(projection.sendProjectionData).toBeDefined();
    expect(projection.initialiseProjectionReceiver).toBeDefined();
  });

  test("isConnected returns false when no presentations", () => {
    const { isConnected } = useProjection(mockBroadcastChannel);

    expect(isConnected()).toBe(false);
  });

  test("isVisible returns true by default", () => {
    const { isVisible } = useProjection(mockBroadcastChannel);

    expect(isVisible()).toBe(true);
  });

  test("it shows the projection", () => {
    const { showProjection } = useProjection(mockBroadcastChannel);

    // Prepare the data.
    const data: IProjectionPayload = {
      currentVerseIndex: 0,
      nowPlaying: {
        qid: Date.now(),
        title: "This is the title",
        content: [["This is a line"]],
      },
    };

    // Call the function.
    showProjection(data);

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
    expect(JSON.stringify(data)).toEqual(mockPostMessage.mock.calls[0][0]);
  });

  test("it hides the projection", () => {
    const { hideProjection, isVisible } = useProjection(mockBroadcastChannel);

    // Call the function.
    hideProjection();

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
    expect(mockPostMessage.mock.calls[0][0]).toBeNull();
    expect(isVisible()).toBe(false);
  });

  test("it sends projection data", () => {
    const { sendProjectionData } = useProjection(mockBroadcastChannel);

    const data: IProjectionPayload = {
      currentVerseIndex: 1,
      nowPlaying: {
        qid: 123,
        title: "Test Title",
        content: [["Test line"]],
      },
    };

    // Call the function.
    sendProjectionData(data);

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
    expect(mockPostMessage.mock.calls[0][0]).toBe(JSON.stringify(data));
  });

  test("it sends null when hiding projection data", () => {
    const { sendProjectionData } = useProjection(mockBroadcastChannel);

    // Call the function with null.
    sendProjectionData(null);

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
    expect(mockPostMessage.mock.calls[0][0]).toBeNull();
  });

  test("openProjection opens a projection and updates state", async () => {
    const { openProjection, isConnected } = useProjection(mockBroadcastChannel);

    await openProjection(IProjectionScreenTypes.audience);

    expect(isConnected()).toBe(true);
  });

  test("closeProjection closes all presentations and resets state", async () => {
    const { openProjection, closeProjection, isConnected, isVisible } =
      useProjection(mockBroadcastChannel);

    // First open a projection
    await openProjection(IProjectionScreenTypes.audience);
    expect(isConnected()).toBe(true);

    // Now close it
    closeProjection();

    expect(isConnected()).toBe(false);
    expect(isVisible()).toBe(true);
  });

  test("initialiseProjectionReceiver adds event listener to channel", () => {
    const { initialiseProjectionReceiver } = useProjection(mockBroadcastChannel);
    const addEventListenerSpy = vi.spyOn(mockBroadcastChannel, "addEventListener");
    const callback = vi.fn();

    initialiseProjectionReceiver(callback);

    expect(addEventListenerSpy).toHaveBeenCalledWith("message", callback);
  });
});
