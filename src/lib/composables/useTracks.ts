// Import the interfaces...
import { type ISearchItem, ISource } from "@interfaces/track";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useMeiliSearch from "@composables/useMeiliSearch";

export default () => {
  // Import the composables.
  const { fromEditableLyrics } = useFormatting();
  const { searchMeiliSearch } = useMeiliSearch();

  const searchTracks = async (phrase: string): Promise<ISearchItem[]> => {
    // Search MeiliSearch for tracks.
    const { hits } = await searchMeiliSearch(phrase);

    // Return the combined results.
    return [
      ...hits.map((hit) => ({
        ...hit,
        lyrics: fromEditableLyrics(hit.lyrics),
        source: ISource.meili,
      })),
    ];
  };

  return { searchTracks };
};
