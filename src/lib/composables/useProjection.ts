import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/apis/useWindowManagementAPI";
import type { IPresentationPayload } from "@interfaces/projection";

export default (channel: BroadcastChannel) => {
  // Import the composables.
  const { isAvailable, project } = useWindowManagementAPI();

  const [projection, setPresentation] = createSignal<WindowProxy | undefined>(
    undefined
  );
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isConnected = (): boolean => projection() !== undefined;

  const openPresentation = async () => {
    const payload = await project(
      Date.now().toString(),
      import.meta.env.VITE_BROADCAST_NAME
    );

    if (payload !== undefined) {
      setPresentation(payload.proxy);
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
    projection()?.close();

    setPresentation(undefined);
    setIsVisible(true);
  };

  const sendData = (data: IPresentationPayload | null) => {
    // Parse the data to a string if not null.
    const processedData = data !== null ? JSON.stringify(data) : null;

    // Send the data over the connections.
    channel.postMessage(processedData);
  };

  return {
    projection,

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
