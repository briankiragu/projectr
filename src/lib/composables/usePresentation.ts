import { createSignal } from "solid-js";

// Import interfaces...
import {
  IProjectionScreenTypes,
  type IProjectionPayload,
} from "@interfaces/projection";

// Import composables...
import usePresentationAPI from "@composables/apis/usePresentationAPI";

export default () => {
  // Extract the composables.
  const {
    getAvailability,
    startPresentation,
    terminatePresentation,
    initialisePresentationController,
    initialisePresentationReceiver,
  } = usePresentationAPI();

  const [isAvailable, setIsAvailable] = createSignal<boolean>(false);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [connections, setConnections] = createSignal<(any | undefined)[]>([]);

  const isConnected = (): boolean =>
    connections().some((conn) => conn !== undefined);

  const setAvailability = (availability: boolean) => {
    setIsAvailable(availability);

    // When the availability drops, it means the connecting cables or wireless
    // display will need to be reconnected. We should clear all
    // existing connections.
    if (!isAvailable()) setConnections([]);
  };

  const openPresentation = async (
    screenType: IProjectionScreenTypes = IProjectionScreenTypes.audience,
  ) => {
    try {
      // Launch the presentation.
      const conn = await startPresentation(Date.now().toString(), screenType);

      // Setup the connection
      setConnections([...connections(), conn]);
    } catch (e) {
      console.error(e);
    }
  };

  const showPresentation = (data: IProjectionPayload | null) => {
    sendPresentationData(data);
    setIsVisible(true);
  };

  const hidePresentation = () => {
    setIsVisible(false);
    sendPresentationData(null);
  };

  const closePresentation = () => {
    // Close the connections.
    connections().forEach((conn) => terminatePresentation(conn));

    // Clear the signals.
    setConnections([]);
    setIsVisible(true);
  };

  const sendPresentationData = (data: IProjectionPayload | null) => {
    // Parse the data to a string if not null.
    const processedData = data !== null ? JSON.stringify(data) : null;

    // Send the data over the connections.
    connections().forEach((conn) => conn?.send(processedData));
  };

  // Get and set the availability.
  getAvailability(setAvailability);

  return {
    isAvailable,
    isConnected,
    isVisible,

    openPresentation,
    showPresentation,
    hidePresentation,
    closePresentation,

    sendPresentationData,

    initialisePresentationController,
    initialisePresentationReceiver,
  };
};
