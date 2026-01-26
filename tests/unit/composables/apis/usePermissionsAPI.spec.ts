import { describe, expect, test, vi, beforeEach } from "vitest";
import usePermissionsAPI from "@composables/apis/usePermissionsAPI";

describe("usePermissionsAPI", () => {
  const { requestWindowManagementPermissions } = usePermissionsAPI();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it returns 'granted' when window-management permission is granted", async () => {
    // Mock navigator.permissions.query
    const mockQuery = vi.fn().mockResolvedValue({ state: "granted" });
    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("granted");
    expect(mockQuery).toHaveBeenCalledWith({
      name: "window-management",
    });
  });

  test("it returns 'denied' when permission is denied", async () => {
    const mockQuery = vi.fn().mockResolvedValue({ state: "denied" });
    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("denied");
  });

  test("it returns 'prompt' when permission is prompt", async () => {
    const mockQuery = vi.fn().mockResolvedValue({ state: "prompt" });
    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("prompt");
  });

  test("it falls back to window-placement permission on TypeError", async () => {
    const mockQuery = vi
      .fn()
      .mockRejectedValueOnce({ name: "TypeError", message: "Not supported" })
      .mockResolvedValueOnce({ state: "granted" });

    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("granted");
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenLastCalledWith({
      name: "window-placement",
    });
  });

  test("it returns error message when first query fails with non-TypeError", async () => {
    const mockQuery = vi.fn().mockRejectedValue({
      name: "SecurityError",
      message: "Not allowed",
    });

    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("SecurityError: Not allowed");
  });

  test("it returns 'Window management not supported' when both queries fail with TypeError", async () => {
    const mockQuery = vi.fn().mockRejectedValue({
      name: "TypeError",
      message: "Not supported",
    });

    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("Window management not supported.");
  });

  test("it returns error message when fallback query fails with non-TypeError", async () => {
    const mockQuery = vi
      .fn()
      .mockRejectedValueOnce({ name: "TypeError", message: "Not supported" })
      .mockRejectedValueOnce({
        name: "NotAllowedError",
        message: "Permission denied",
      });

    Object.defineProperty(navigator, "permissions", {
      value: { query: mockQuery },
      writable: true,
      configurable: true,
    });

    const result = await requestWindowManagementPermissions();

    expect(result).toBe("NotAllowedError: Permission denied");
  });
});
