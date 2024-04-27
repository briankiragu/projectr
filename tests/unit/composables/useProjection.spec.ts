import useProjection from "@composables/useProjection";
import { describe } from "vitest";

describe("useProjection", () => {
  // Define a mock for the BroadcastChannel.
  const mockBroadcastChannel = new BroadcastChannel("vitest");
  const mockPostMessage = vi.spyOn(mockBroadcastChannel, "postMessage");

  // // Extract the composable methods.
  const { showProjection } = useProjection(mockBroadcastChannel);

  test("it shows projection", () => {
    // Call the function.
    showProjection(null);

    // Make the assertions.
    expect(mockPostMessage).toHaveBeenCalledOnce();
  });
});
