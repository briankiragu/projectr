import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/apis/useWindowManagementAPI";
import {
  IProjectionScreenTypes,
  type IProjectionPayload,
} from "@interfaces/projection";

export default (channel: BroadcastChannel) => {
  // Import the composables.
  const { isAvailable, project } = useWindowManagementAPI();

  const [presentations, setProjections] = createSignal<WindowProxy[]>([]);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isConnected = (): boolean => presentations().length > 0;

  const openProjection = async (
    screenType: IProjectionScreenTypes = IProjectionScreenTypes.audience,
  ) => {
    // Launch a presentation instance.
    const payload = await project(
      "projectr",
      import.meta.env.VITE_BROADCAST_NAME,
      screenType,
    );

    if (payload?.proxy !== undefined) {
      // Save the Window proxies in the state.
      setProjections([...presentations(), payload.proxy]);
    }
  };

  const showProjection = (data: IProjectionPayload | null) => {
    sendProjectionData(data);
    setIsVisible(true);
  };

  const hideProjection = () => {
    setIsVisible(false);
    sendProjectionData(null);
  };

  const closeProjection = () => {
    // Close each proxy.
    presentations()?.forEach((presentation) => presentation?.close());

    setProjections([]);
    setIsVisible(true);
  };

  const sendProjectionData = (data: IProjectionPayload | null) => {
    // Parse the data to a string if not null.
    const processedData = data !== null ? JSON.stringify(data) : null;

    // Send the data over the connections.
    channel.postMessage(processedData);
  };

  const initialiseProjectionReceiver = (
    callback: (event: MessageEvent) => void
  ) => {
    // When a message relays on the channel.
    channel.addEventListener("message", callback);
  };

  return {
    isAvailable,
    isConnected,
    isVisible,

    openProjection,
    showProjection,
    hideProjection,
    closeProjection,

    sendProjectionData,

    initialiseProjectionReceiver,
  };
};
