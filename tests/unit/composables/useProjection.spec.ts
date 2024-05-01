import useProjection from "@composables/useProjection";
import type { IProjectionPayload } from "@interfaces/projection";
import { describe } from "vitest";

describe("useProjection", () => {
  // Define a mock for the BroadcastChannel.
  const mockBroadcastChannel = new BroadcastChannel("testing");
  const mockPostMessage = vi.spyOn(mockBroadcastChannel, "postMessage");

  // Extract the composable methods.
  const { hideProjection, showProjection } =
    useProjection(mockBroadcastChannel);

  test("it shows the projection", () => {
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
    // Call the function.
    hideProjection();

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
    expect(null).toEqual(mockPostMessage.mock.calls[0][0]);
  });
});
