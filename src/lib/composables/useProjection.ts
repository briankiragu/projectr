import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/apis/useWindowManagementAPI";
import type { IPresentationPayload } from "@interfaces/projection";

export default (channel: BroadcastChannel) => {
  // Import the composables.
  const { isAvailable, project } = useWindowManagementAPI();

  const [presentations, setPresentations] = createSignal<WindowProxy[]>([]);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isConnected = (): boolean => presentations().length > 0;

  const openPresentation = async () => {
    // Launch a presentation instance.
    const payload = await project(
      Date.now().toString(),
      import.meta.env.VITE_BROADCAST_NAME
    );

    if (payload?.proxy !== undefined) {
      // Save the Window proxies in the state.
      setPresentations([...presentations(), payload.proxy]);
    }
  };

  const showPresentation = (data: IPresentationPayload | null) => {
    setIsVisible(true);
    sendData(data);
  };

  const hidePresentation = () => {
    setIsVisible(false);
    sendData(null);
  };

  const closePresentation = () => {
    // Close each proxy.
    presentations()?.forEach((presentation) => presentation?.close());

    setPresentations([]);
    setIsVisible(true);
  };

  const sendData = (data: IPresentationPayload | null) => {
    // Parse the data to a string if not null.
    const processedData = data !== null ? JSON.stringify(data) : null;

    // Send the data over the connections.
    channel.postMessage(processedData);
  };

  return {
    isAvailable,
    isConnected,
    isVisible,

    openPresentation,
    showPresentation,
    hidePresentation,
    closePresentation,

    sendData,
  };
};
