import { createSignal } from "solid-js";

// Import interfaces...
import type { IProjectionPayload } from "@interfaces/projection";

// Import composables...
import usePresentationAPI from "@composables/apis/usePresentationAPI";

export default () => {
  // Import the composables.
  const {
    isAvailable,
    setPresentationConnection,
    addPresentationConnection,
    startPresentation,
    terminatePresentation,
    initialisePresentationController,
    initialisePresentationReceiver,
  } = usePresentationAPI();

  const [connection, setConnection] = createSignal<any | undefined>(undefined);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isConnected = (): boolean => connection()?.state === "connected";

  const openPresentation = async () => {
    try {
      // Launch the presentation.
      const conn = await startPresentation();
      setConnection(conn);
    } catch (e) {
      console.error(e);
    }
  };

  const showPresentation = (data: IProjectionPayload | null) => {
    connection()?.send(JSON.stringify(data));
    setIsVisible(true);
  };

  const hidePresentation = () => {
    setIsVisible(false);
    connection()?.send(null);
  };

  const closePresentation = () => {
    terminatePresentation(connection());
    setConnection(undefined);
    setIsVisible(true);
  };

  return {
    connection,

    isVisible,
    isAvailable,
    isConnected,

    setPresentationConnection,
    addPresentationConnection,

    openPresentation,
    showPresentation,
    hidePresentation,
    closePresentation,

    initialisePresentationController,
    initialisePresentationReceiver,
  };
};
