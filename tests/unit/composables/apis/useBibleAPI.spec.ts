import { describe, expect, test, vi, beforeEach } from "vitest";
import useBibleAPI from "@composables/apis/useBibleAPI";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useBibleAPI", () => {
  const { getVersions, getBooks, getChapters, getVerses, getContent } =
    useBibleAPI();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getVersions", () => {
    test("it fetches Bible versions successfully", async () => {
      const mockData = [
        { id: "1", name: "NIV", abbreviation: "NIV" },
        { id: "2", name: "KJV", abbreviation: "KJV" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      });

      const result = await getVersions();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test("it throws an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      await expect(getVersions()).rejects.toThrow("Internal Server Error");
    });
  });

  describe("getBooks", () => {
    test("it fetches books for a Bible version", async () => {
      const mockData = [
        { id: "GEN", name: "Genesis" },
        { id: "EXO", name: "Exodus" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      });

      const result = await getBooks("bible-id");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test("it throws an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(getBooks("invalid-id")).rejects.toThrow("Not Found");
    });
  });

  describe("getChapters", () => {
    test("it fetches chapters for a book", async () => {
      const mockData = [
        { id: "GEN.1", number: "1" },
        { id: "GEN.2", number: "2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      });

      const result = await getChapters("bible-id", "GEN");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test("it throws an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      await expect(getChapters("bible-id", "INVALID")).rejects.toThrow(
        "Bad Request"
      );
    });
  });

  describe("getVerses", () => {
    test("it fetches verses for a chapter", async () => {
      const mockData = [
        { id: "GEN.1.1", reference: "Genesis 1:1" },
        { id: "GEN.1.2", reference: "Genesis 1:2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      });

      const result = await getVerses("bible-id", "GEN.1");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test("it throws an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Server Error",
      });

      await expect(getVerses("bible-id", "GEN.1")).rejects.toThrow(
        "Server Error"
      );
    });
  });

  describe("getContent", () => {
    test("it fetches content for a verse", async () => {
      const mockData = {
        id: "GEN.1.1",
        content: "In the beginning God created...",
        reference: "Genesis 1:1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      });

      const result = await getContent("bible-id", "GEN.1.1");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test("it throws an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(getContent("bible-id", "INVALID")).rejects.toThrow(
        "Not Found"
      );
    });
  });
});
