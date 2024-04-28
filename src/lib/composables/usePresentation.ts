import { createSignal } from "solid-js";

// Import interfaces...
import type { IProjectionPayload } from "@interfaces/projection";

// Import composables...
import usePresentationAPI from "@composables/apis/usePresentationAPI";

export default () => {
  // Import the composables.
  const {
    presentationRequest,
    isAvailable,
    setPresentationConnection,
    addPresentationConnection,
    startPresentation,
    closePresentation,
  } = usePresentationAPI();

  const [connection, setConnection] = createSignal<any>(undefined);
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isConnected = (): boolean => connection()?.state === "connected";

  const openPresentation = async () => {
    try {
      // Launch the presentation.
      const connection = await startPresentation();
      setConnection(connection);
    } catch {
      console.dir("Could not open presentation");
    }
  };

  const showPresentation = (data: IProjectionPayload | null) => {
    connection().send(JSON.stringify(data));
    setIsVisible(true);
  };

  const hidePresentation = () => {
    setIsVisible(false);
    connection().send(null);
  };

  const stopPresentation = () => {
    closePresentation(connection());
    setConnection(undefined);
    setIsVisible(true);
  };

  return {
    presentationRequest,
    isVisible,

    isAvailable,
    isConnected,

    setPresentationConnection,
    addPresentationConnection,

    openPresentation,
    showPresentation,
    hidePresentation,
    stopPresentation,
  };
};
