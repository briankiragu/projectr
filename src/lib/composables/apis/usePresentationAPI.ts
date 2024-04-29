// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default () => {
  // Prepare the request with the presentation URLs.
  const presentationRequest = new PresentationRequest(["present"]);

  const isAvailable = async (): Promise<boolean> => {
    const availability = await presentationRequest.getAvailability();
    return availability.value;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPresentationConnection = (connection: any | undefined) => {
    if (connection !== undefined) {
      // Set the new connection and save the presentation ID
      localStorage["presId"] = connection.id;

      // Monitor the connection state
      connection.onconnect = () => {
        // Register message handler
        connection.onmessage = (message: MessageEvent) => {
          console.log(`[Presentation] Received message: ${message.data}`);
        };
        console.info("[Presentation] Connected...");
      };

      connection.onclose = () => {
        connection = null;
        console.info("[Presentation] Closed...");
      };

      connection.onterminate = () => {
        // Remove presId from localStorage if exists
        delete localStorage["presId"];
        connection = null;
        console.info("[Presentation] Terminated...");
      };
    }

    return connection;
  };

  const addPresentationConnection = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conn: any,
    callback: (message: MessageEvent) => void
  ) => {
    // Listen for new messages.
    conn.onmessage = (message: MessageEvent) => callback(message);

    // Listen for connection close.
    conn.onclose = (event: CloseEvent) => {
      console.log("[Presentation] Connection closed!", event.reason);
    };
  };

  const startPresentation = async () => {
    try {
      // Start new presentation.
      let connection = await presentationRequest.start();

      // The connection to the presentation will be passed on success.
      connection = setPresentationConnection(connection);

      // Return the connection
      return connection;
    } catch (e: Error) {
      // Otherwise, the user canceled the selection dialog or no screens were found.
      throw new Error(`[Presentation] Failed to start with reason: ${e}`);
    }
  };

  const reconnectPresentation = async () => {
    try {
      // Read presId from localStorage if exists
      const presId = localStorage["presId"];

      // Start new presentation.
      let connection = await presentationRequest.reconnect(presId);

      // The connection to the presentation will be passed on success.
      connection = setPresentationConnection(connection);

      // Return the connection
      return connection;
    } catch {
      // No connection found for presUrl and presId, or an error occurred.
      throw new Error(`[Presentation] Failed to reconnect with reason: ${e}`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const closePresentation = (connection: any | undefined) => {
    connection?.close();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const terminatePresentation = (connection: any | undefined) => {
    connection?.terminate();
  };

  const initialisePresentationController = () => {
    navigator.presentation.defaultRequest = presentationRequest;
    navigator.presentation.defaultRequest.onconnectionavailable = ({ conn }) =>
      setPresentationConnection(conn);
  };

  const initialisePresentationReceiver = (
    callback: (message: MessageEvent) => void
  ) => {
    navigator.presentation.receiver?.connectionList.then((list) => {
      list.connections.map((conn) => addPresentationConnection(conn, callback));
      list.onconnectionavailable = ({ conn }) =>
        addPresentationConnection(conn, callback);
    });
  };

  return {
    presentationRequest,

    isAvailable,

    setPresentationConnection,

    startPresentation,
    reconnectPresentation,
    terminatePresentation,
    closePresentation,

    initialisePresentationController,
    initialisePresentationReceiver,
  };
};
