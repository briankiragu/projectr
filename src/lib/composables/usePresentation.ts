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
    startPresentation,
    terminatePresentation,
    initialisePresentationController,
    initialisePresentationReceiver,
  } = usePresentationAPI();

  const [connection, setConnection] = createSignal<any | undefined>(undefined);
  const [isConnected, setIsConnected] = createSignal<boolean>(false);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const openPresentation = async () => {
    try {
      // Launch the presentation.
      const conn = await startPresentation();

      // Setup the connection
      setConnection(conn);

      // Set the connected state.
      setIsConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const showPresentation = (data: IProjectionPayload | null) => {
    connection()?.send(JSON.stringify(data));
    setIsVisible(true);
  };

  const hidePresentation = () => {
    connection()?.send(null);
    setIsVisible(false);
  };

  const closePresentation = () => {
    terminatePresentation(connection());
    setConnection(undefined);
    setIsConnected(false);
    setIsVisible(true);
  };

  return {
    connection,

    isVisible,
    isAvailable,
    isConnected,

    setPresentationConnection,

    openPresentation,
    showPresentation,
    hidePresentation,
    closePresentation,

    initialisePresentationController,
    initialisePresentationReceiver,
  };
};
