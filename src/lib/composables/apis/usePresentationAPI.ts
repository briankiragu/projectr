export default () => {
  // Prepare the request with the presentation URLs.
  const presentationRequest = new PresentationRequest(["present"]);

  // Const communication ackowledgement token.
  const token = "Say hello";

  const isAvailable = async (): boolean => {
    const availability = await presentationRequest.getAvailability();
    return availability.value;
  };

  const setPresentationConnection = (connection: any | undefined) => {
    if (connection !== undefined) {
      // Set the new connection and save the presentation ID
      localStorage["presId"] = connection.id;

      // Monitor the connection state
      connection.addEventListener("connect", () => {
        // Register message handler
        connection.addEventListener("message", (message: MessageEvent) => {
          console.log(`Received message: ${message.data}`);
        });

        // Send initial message to presentation page
        connection.send(token);
        console.info("Connected...");
      });

      // Monitor the disconnection state
      connection.addEventListener("disconnect", () => {
        console.info("Disconnected...");
      });

      connection.addEventListener("close", () => {
        connection = null;
        console.info("Closed...");
      });

      connection.addEventListener("terminate", () => {
        // Remove presId from localStorage if exists
        delete localStorage["presId"];
        connection = null;
        console.info("Terminated...");
      });
    }

    return connection;
  };

  const addPresentationConnection = (connection: any) => {
    connection.addEventListener("message", (message: MessageEvent) => {
      if (message.data === token) connection.send(token);
    });

    connection.addEventListener("close", (event: CloseEvent) => {
      console.log("Connection closed!", event.reason);
    });
  };

  const startPresentation = async () => {
    try {
      // Start new presentation.
      let connection = await presentationRequest.start();

      // The connection to the presentation will be passed on success.
      connection = setPresentationConnection(connection);

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
        let connection = await presentationRequest.reconnect(presId);

        // The connection to the presentation will be passed on success.
        connection = setPresentationConnection(connection);

        // Return the connection
        return connection;
      } catch {
        // No connection found for presUrl and presId, or an error occurred.
        console.dir("Failed to start presentation");
      }
    }
  };

  const closePresentation = (connection: any | undefined) => {
    connection?.close();
  };

  const terminatePresentation = (connection: any | undefined) => {
    connection?.terminate();
  };

  const initialisePresentationController = () => {
    navigator.presentation.defaultRequest = presentationRequest;
    navigator.presentation.defaultRequest.addEventListener(
      "connectionavailable",
      ({ conn }) => setPresentationConnection(conn)
    );
  };

  const initialisePresentationReceiver = () => {
    navigator.presentation.receiver?.connectionList.then((list) => {
      list.connections.map((conn) => addPresentationConnection(conn));
      list.addEventListener("connectionavailable", ({ conn }) =>
        addPresentationConnection(conn)
      );
    });
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

    initialisePresentationController,
    initialisePresentationReceiver,
  };
};
