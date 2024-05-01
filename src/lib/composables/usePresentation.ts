import { createSignal } from "solid-js";

// Import interfaces...
import type { IProjectionPayload } from "@interfaces/projection";

// Import composables...
import usePresentationAPI from "@composables/apis/usePresentationAPI";

export default () => {
  // Import the composables.
  const {
    getAvailability,
    setPresentationConnection,
    startPresentation,
    terminatePresentation,
    initialisePresentationController,
    initialisePresentationReceiver,
  } = usePresentationAPI();

  const [isAvailable, setIsAvailable] = createSignal<boolean>(false);
  const [isConnected, setIsConnected] = createSignal<boolean>(false);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [connections, setConnections] = createSignal<(any | undefined)[]>([]);

  // Get and set the availability.
  getAvailability(setIsAvailable);

  const openPresentation = async () => {
    try {
      // Launch the presentation.
      const conn = await startPresentation(Date.now().toString());

      // Setup the connection
      setConnections([...connections(), conn]);

      // Set the connected state.
      setIsConnected(connections().some((conn) => conn !== undefined));
    } catch (e) {
      console.error(e);
    }
  };

  const showPresentation = (data: IProjectionPayload | null) => {
    // Send the data over the connections.
    connections().forEach((conn) => conn?.send(JSON.stringify(data)));

    // Clear the signals.
    setIsVisible(true);
  };

  const hidePresentation = () => {
    // Send the data over the connections.
    connections().forEach((conn) => conn?.send(null));

    // Clear the signals.
    setIsVisible(false);
  };

  const closePresentation = () => {
    // Close the connections.
    connections().forEach((conn) => terminatePresentation(conn));

    // Clear the signals.
    setConnections([]);
    setIsConnected(false);
    setIsVisible(true);
  };

  return {
    connections,

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
