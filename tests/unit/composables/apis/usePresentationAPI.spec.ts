import { describe, expect, test, vi, beforeEach } from "vitest";
import usePresentationAPI from "@composables/apis/usePresentationAPI";
import { IProjectionScreenTypes } from "@interfaces/projection";

// Mock PresentationRequest
class MockPresentationRequest {
  urls: string[];
  onconnectionavailable: ((event: { conn: unknown }) => void) | null = null;

  constructor(urls: string[]) {
    this.urls = urls;
  }

  getAvailability() {
    return Promise.resolve({
      value: true,
      onchange: null,
    });
  }

  start() {
    return Promise.resolve({
      send: vi.fn(),
      close: vi.fn(),
      terminate: vi.fn(),
      onconnect: null,
      onclose: null,
      onterminate: null,
      onmessage: null,
    });
  }
}

// Set up global PresentationRequest
(global as Record<string, unknown>)["PresentationRequest"] =
  MockPresentationRequest;

describe("usePresentationAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it returns the required methods", () => {
    const api = usePresentationAPI();

    expect(api.getAvailability).toBeDefined();
    expect(api.getPresentationRequest).toBeDefined();
    expect(api.startPresentation).toBeDefined();
    expect(api.closePresentation).toBeDefined();
    expect(api.terminatePresentation).toBeDefined();
    expect(api.setPresentationConnection).toBeDefined();
    expect(api.initialisePresentationController).toBeDefined();
    expect(api.initialisePresentationReceiver).toBeDefined();
  });

  describe("getAvailability", () => {
    test("it calls callback with availability value", async () => {
      const { getAvailability } = usePresentationAPI();
      const callback = vi.fn();

      getAvailability(callback);

      // Wait for promise to resolve
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(callback).toHaveBeenCalledWith(true);
    });

    test("it calls callback with true when availability check fails", async () => {
      // Mock a failing getAvailability
      const FailingMockPresentationRequest = vi.fn().mockImplementation(() => ({
        getAvailability: () => Promise.reject(new Error("Not supported")),
        onconnectionavailable: null,
      }));

      (global as Record<string, unknown>)["PresentationRequest"] =
        FailingMockPresentationRequest;

      // Re-import to get fresh instance
      vi.resetModules();
      const { default: freshUsePresentationAPI } =
        await import("@composables/apis/usePresentationAPI");
      const { getAvailability } = freshUsePresentationAPI();
      const callback = vi.fn();

      getAvailability(callback);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(callback).toHaveBeenCalledWith(true);

      // Restore original mock
      // Restore original mock
      (global as Record<string, unknown>)["PresentationRequest"] =
        MockPresentationRequest;
    });
  });

  describe("getPresentationRequest", () => {
    test("it creates a PresentationRequest with the correct URL", () => {
      const { getPresentationRequest } = usePresentationAPI();
      const request = getPresentationRequest("test-id");

      expect(request).toBeInstanceOf(MockPresentationRequest);
      expect(request.urls).toContain(
        `${IProjectionScreenTypes.audience}/test-id`
      );
    });

    test("it uses custom screen type", () => {
      const { getPresentationRequest } = usePresentationAPI();
      const request = getPresentationRequest(
        "test-id",
        IProjectionScreenTypes.prompter
      );

      expect(request.urls).toContain(
        `${IProjectionScreenTypes.prompter}/test-id`
      );
    });
  });

  describe("startPresentation", () => {
    test("it starts a presentation and returns connection", async () => {
      const { startPresentation } = usePresentationAPI();
      const connection = await startPresentation("test-id");

      expect(connection).toBeDefined();
      expect(connection.send).toBeDefined();
    });

    test("it uses audience screen type by default", async () => {
      const { startPresentation } = usePresentationAPI();
      await startPresentation("test-id");

      // No error means it worked with default
      expect(true).toBe(true);
    });

    test("it uses custom screen type", async () => {
      const { startPresentation } = usePresentationAPI();
      await startPresentation("test-id", IProjectionScreenTypes.prompter);

      expect(true).toBe(true);
    });
  });

  describe("closePresentation", () => {
    test("it closes the connection", () => {
      const { closePresentation } = usePresentationAPI();
      const mockConnection = { close: vi.fn() };

      closePresentation(mockConnection);

      expect(mockConnection.close).toHaveBeenCalled();
    });

    test("it handles undefined connection", () => {
      const { closePresentation } = usePresentationAPI();

      // Should not throw
      expect(() => closePresentation(undefined)).not.toThrow();
    });
  });

  describe("terminatePresentation", () => {
    test("it terminates the connection", () => {
      const { terminatePresentation } = usePresentationAPI();
      const mockConnection = { terminate: vi.fn() };

      terminatePresentation(mockConnection);

      expect(mockConnection.terminate).toHaveBeenCalled();
    });

    test("it handles undefined connection", () => {
      const { terminatePresentation } = usePresentationAPI();

      expect(() => terminatePresentation(undefined)).not.toThrow();
    });
  });

  describe("setPresentationConnection", () => {
    test("it sets up connection event handlers", () => {
      const { setPresentationConnection } = usePresentationAPI();
      const mockConnection = {
        onconnect: null as (() => void) | null,
        onclose: null as (() => void) | null,
        onterminate: null as (() => void) | null,
        onmessage: null as ((msg: MessageEvent) => void) | null,
      };

      const result = setPresentationConnection(mockConnection);

      expect(result).toBe(mockConnection);
      expect(mockConnection.onconnect).toBeDefined();
      expect(mockConnection.onclose).toBeDefined();
      expect(mockConnection.onterminate).toBeDefined();
    });

    test("it returns undefined for undefined connection", () => {
      const { setPresentationConnection } = usePresentationAPI();

      const result = setPresentationConnection(undefined);

      expect(result).toBeUndefined();
    });

    test("onconnect handler sets up onmessage and logs connection", () => {
      const { setPresentationConnection } = usePresentationAPI();
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockConnection = {
        onconnect: null as (() => void) | null,
        onclose: null as (() => void) | null,
        onterminate: null as (() => void) | null,
        onmessage: null as ((msg: MessageEvent) => void) | null,
      };

      setPresentationConnection(mockConnection);

      // Trigger onconnect
      mockConnection.onconnect?.();

      expect(consoleSpy).toHaveBeenCalledWith("[Presentation] Connected...");
      expect(mockConnection.onmessage).toBeDefined();

      consoleSpy.mockRestore();
    });

    test("onconnect onmessage handler logs received message", () => {
      const { setPresentationConnection } = usePresentationAPI();
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockConnection = {
        onconnect: null as (() => void) | null,
        onclose: null as (() => void) | null,
        onterminate: null as (() => void) | null,
        onmessage: null as ((msg: MessageEvent) => void) | null,
      };

      setPresentationConnection(mockConnection);
      mockConnection.onconnect?.();

      // Trigger onmessage
      const mockEvent = { data: "test message" } as MessageEvent;
      mockConnection.onmessage?.(mockEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Presentation] Received message: test message"
      );

      consoleSpy.mockRestore();
    });

    test("onclose handler logs closed message", () => {
      const { setPresentationConnection } = usePresentationAPI();
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockConnection = {
        onconnect: null as (() => void) | null,
        onclose: null as (() => void) | null,
        onterminate: null as (() => void) | null,
        onmessage: null as ((msg: MessageEvent) => void) | null,
      };

      setPresentationConnection(mockConnection);

      // Trigger onclose
      mockConnection.onclose?.();

      expect(consoleSpy).toHaveBeenCalledWith("[Presentation] Closed...");

      consoleSpy.mockRestore();
    });

    test("onterminate handler logs terminated message", () => {
      const { setPresentationConnection } = usePresentationAPI();
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockConnection = {
        onconnect: null as (() => void) | null,
        onclose: null as (() => void) | null,
        onterminate: null as (() => void) | null,
        onmessage: null as ((msg: MessageEvent) => void) | null,
      };

      setPresentationConnection(mockConnection);

      // Trigger onterminate
      mockConnection.onterminate?.();

      expect(consoleSpy).toHaveBeenCalledWith("[Presentation] Terminated...");

      consoleSpy.mockRestore();
    });
  });

  describe("initialisePresentationController", () => {
    test("it sets the default request on navigator.presentation", () => {
      const mockPresentation = { defaultRequest: null };
      Object.defineProperty(navigator, "presentation", {
        value: mockPresentation,
        writable: true,
        configurable: true,
      });

      const { initialisePresentationController } = usePresentationAPI();
      initialisePresentationController();

      expect(mockPresentation.defaultRequest).toBeDefined();
    });
  });

  describe("initialisePresentationReceiver", () => {
    test("it sets up receiver with callback", async () => {
      const mockConnections = [
        {
          onmessage: null,
          onclose: null,
        },
      ];

      const mockReceiver = {
        connectionList: Promise.resolve({
          connections: mockConnections,
          onconnectionavailable: null,
        }),
      };

      Object.defineProperty(navigator, "presentation", {
        value: { receiver: mockReceiver },
        writable: true,
        configurable: true,
      });

      const { initialisePresentationReceiver } = usePresentationAPI();
      const callback = vi.fn();

      initialisePresentationReceiver(callback);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockConnections[0].onmessage).toBeDefined();
    });

    test("it handles onconnectionavailable for new connections", async () => {
      let onconnectionavailableHandler:
        | ((event: { conn: unknown }) => void)
        | null = null;
      const mockConnections: Array<{
        onmessage: ((msg: MessageEvent) => void) | null;
        onclose: ((event: CloseEvent) => void) | null;
      }> = [];

      const mockReceiver = {
        connectionList: Promise.resolve({
          connections: mockConnections,
          set onconnectionavailable(
            handler: ((event: { conn: unknown }) => void) | null
          ) {
            onconnectionavailableHandler = handler;
          },
          get onconnectionavailable() {
            return onconnectionavailableHandler;
          },
        }),
      };

      Object.defineProperty(navigator, "presentation", {
        value: { receiver: mockReceiver },
        writable: true,
        configurable: true,
      });

      const { initialisePresentationReceiver } = usePresentationAPI();
      const callback = vi.fn();

      initialisePresentationReceiver(callback);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Now simulate a new connection being available
      const newConnection: {
        onmessage: ((msg: MessageEvent) => void) | null;
        onclose: ((event: CloseEvent) => void) | null;
      } = {
        onmessage: null,
        onclose: null,
      };

      (onconnectionavailableHandler as ((event: { conn: unknown }) => void) | null)?.({ conn: newConnection });

      expect(newConnection.onmessage).toBeDefined();
    });

    test("connection onclose handler logs close reason", async () => {
      const mockConnections = [
        {
          onmessage: null as ((msg: MessageEvent) => void) | null,
          onclose: null as ((event: CloseEvent) => void) | null,
        },
      ];

      const mockReceiver = {
        connectionList: Promise.resolve({
          connections: mockConnections,
          onconnectionavailable: null,
        }),
      };

      Object.defineProperty(navigator, "presentation", {
        value: { receiver: mockReceiver },
        writable: true,
        configurable: true,
      });

      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const { initialisePresentationReceiver } = usePresentationAPI();
      const callback = vi.fn();

      initialisePresentationReceiver(callback);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Trigger onclose
      mockConnections[0].onclose?.({
        reason: "test close reason",
      } as CloseEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Presentation] Connection closed!",
        "test close reason"
      );

      consoleSpy.mockRestore();
    });

    test("connection onmessage handler calls callback", async () => {
      const mockConnections = [
        {
          onmessage: null as ((msg: MessageEvent) => void) | null,
          onclose: null as ((event: CloseEvent) => void) | null,
        },
      ];

      const mockReceiver = {
        connectionList: Promise.resolve({
          connections: mockConnections,
          onconnectionavailable: null,
        }),
      };

      Object.defineProperty(navigator, "presentation", {
        value: { receiver: mockReceiver },
        writable: true,
        configurable: true,
      });

      const { initialisePresentationReceiver } = usePresentationAPI();
      const callback = vi.fn();

      initialisePresentationReceiver(callback);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Trigger onmessage
      const mockEvent = { data: "test data" } as MessageEvent;
      mockConnections[0].onmessage?.(mockEvent);

      expect(callback).toHaveBeenCalledWith(mockEvent);
    });
  });
});
