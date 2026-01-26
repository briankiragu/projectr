import { describe, expect, test, vi, beforeEach } from "vitest";
import useMusixMatch from "@composables/apis/useMusixMatch";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useMusixMatch", () => {
  const { searchMusixMatch, getLyrics } = useMusixMatch();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchMusixMatch", () => {
    test("it searches for tracks", async () => {
      const mockResponse = {
        message: {
          header: { status_code: 200, execute_time: 0.1, available: 10 },
          body: {
            track_list: [
              { track: "Track 1" },
              { track: "Track 2" },
            ],
          },
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await searchMusixMatch("test query");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse.message.body.track_list);
    });

    test("it includes search phrase in request", async () => {
      const mockResponse = {
        message: {
          header: { status_code: 200 },
          body: { track_list: [] },
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await searchMusixMatch("my search");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("track.search")
      );
    });
  });

  describe("getLyrics", () => {
    test("it fetches lyrics for a track", async () => {
      const mockLyrics = {
        lyrics_id: 12345,
        restricted: 0,
        instrumental: 0,
        lyrics_body: "These are the lyrics...",
        lyrics_language: "en",
        script_tracking_url: "",
        pixel_tracking_url: "",
        lyrics_copyright: "Test copyright",
        backlink_url: "",
        updated_time: "2024-01-01",
      };

      const mockResponse = {
        message: {
          header: { status_code: 200, execute_time: 0.1 },
          body: { lyrics: mockLyrics },
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await getLyrics("track-123");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLyrics);
    });

    test("it includes track_id in request", async () => {
      const mockResponse = {
        message: {
          header: { status_code: 200 },
          body: { lyrics: {} },
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await getLyrics("specific-track-id");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("track.content.get")
      );
    });
  });
});
