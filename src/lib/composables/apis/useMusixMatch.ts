import type {
  IMusixMatchLyrics,
  IMusixMatchLyricsResponse,
  IMusixMatchTrack,
  IMusixMatchTrackListResponse,
} from "@interfaces/musixmatch";

const apiUrl: string = import.meta.env.VITE_MUSIXMATCH_API_URL;
const apiKey: string = import.meta.env.VITE_MUSIXMATCH_API_KEY;

export default () => {
  const searchMusixMatch = async (
    phrase: string
  ): Promise<IMusixMatchTrack[]> => {
    // Create the search params.
    const searchParams = new URLSearchParams({
      apiKey,
      q: phrase,
    });

    // Make the request.
    const response = await fetch(
      `${apiUrl}/track.search?${searchParams.toString()}`
    );

    // Return the response.
    return (response as unknown as IMusixMatchTrackListResponse).message.body
      .track_list;
  };

  const getLyrics = async (trackId: string): Promise<IMusixMatchLyrics> => {
    // Create the search params.
    const searchParams = new URLSearchParams({
      apiKey,
      track_id: trackId,
    });

    // Make the request.
    const response = await fetch(
      `${apiUrl}/track.content.get?${searchParams.toString()}`
    );

    // Return the response.
    return (response as unknown as IMusixMatchLyricsResponse).message.body
      .lyrics;
  };

  return { searchMusixMatch, getLyrics };
};
