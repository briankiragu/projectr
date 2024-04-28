export default () => {
  // Prepare the request with the presentation URLs.
  const presentationRequest = new PresentationRequest(["present"]);

  // Const communication ackowledgement token.
  const token = "Say hello";

  const isAvailable = async (): boolean => {
    const availability = await presentationRequest.getAvailability();
    return availability.value;
  };

  const setPresentationConnection = (connection: any) => {
    // Set the new connection and save the presentation ID
    localStorage["presId"] = connection.id;

    // Monitor the connection state
    connection.onconnect = () => {
      // Register message handler
      connection.onmessage = (message: MessageEvent) => {
        console.log(`Received message: ${message.data}`);
      };

      // Send initial message to presentation page
      connection.send(token);
    };

    connection.onclose = () => {
      connection = null;
    };

    connection.onterminate = () => {
      // Remove presId from localStorage if exists
      delete localStorage["presId"];
      connection = null;
    };
  };

  const addPresentationConnection = (connection: any) => {
    connection.onmessage = (message: MessageEvent) => {
      if (message.data === token) connection.send("hello");
    };
  };

  const startPresentation = async () => {
    try {
      // Start new presentation.
      const connection = await presentationRequest.start();

      // The connection to the presentation will be passed on success.
      setPresentationConnection(connection);

      // Return the connection
      return connection;
    } catch {
      // Otherwise, the user canceled the selection dialog or no screens were found.
      console.dir("Failed to start presentation");
    }
  };

  const reconnectPresentation = async () => {
    // read presId from localStorage if exists
    const presId = localStorage["presId"];

    // presId is mandatory when reconnecting to a presentation.
    if (presId) {
      try {
        // Start new presentation.
        const connection = await presentationRequest.reconnect(presId);

        // The connection to the presentation will be passed on success.
        setPresentationConnection(connection);

        // Return the connection
        return connection;
      } catch {
        // No connection found for presUrl and presId, or an error occurred.
        console.dir("Failed to start presentation");
      }
    }
  };

  const terminatePresentation = (connection: any | undefined) => {
    connection?.terminate();
  };

  const closePresentation = (connection: any | undefined) => {
    connection?.close();
  };

  return {
    presentationRequest,
    isAvailable,
    setPresentationConnection,
    addPresentationConnection,
    startPresentation,
    reconnectPresentation,
    terminatePresentation,
    closePresentation,
  };
};
