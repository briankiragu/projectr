export default () => {
  // Prepare the request with the presentation URLs.
  const presentationRequest = new PresentationRequest(["present"]);

  const isAvailable = async (): Promise<boolean> => {
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

  const addPresentationConnection = (
    conn: any,
    callback: (message: MessageEvent) => void
  ) => {
    // Listen for new messages.
    conn.addEventListener("message", (message: MessageEvent) =>
      callback(message)
    );

    // Listen for connection close.
    conn.addEventListener("close", (event: CloseEvent) => {
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
      console.error("Failed to start presentation");
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
        console.error("Failed to start presentation");
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

  const initialisePresentationReceiver = (
    callback: (message: MessageEvent) => void
  ) => {
    navigator.presentation.receiver?.connectionList.then((list) => {
      list.connections.map((conn) => addPresentationConnection(conn, callback));
      list.addEventListener("connectionavailable", ({ conn }) =>
        addPresentationConnection(conn, callback)
      );
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
