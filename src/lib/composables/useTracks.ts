// Import the interfaces...
import { type ISearchItem, ISource, type ITrack } from "@interfaces/track";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useMeiliSearch from "@composables/useMeiliSearch";

export default () => {
  // Import the composables.
  const { fromEditableLyrics } = useFormatting();
  const { searchMeiliSearch, addDocuments } = useMeiliSearch();

  const searchTracks = async (phrase: string): Promise<ISearchItem[]> => {
    // Search MeiliSearch for tracks.
    const { hits } = await searchMeiliSearch(phrase);

    // Return the combined results.
    return [
      ...(hits as ITrack[]).map((hit) => ({ ...hit, source: ISource.meili })),
    ];
  };

  const addTrack = async (title: string, lyrics: string) => {
    // Create the document.
    const track = { id: Date.now(), title, lyrics: fromEditableLyrics(lyrics) };

    // Make the request to Meilisearch.
    addDocuments([track]);
  };

  return { searchTracks, addTrack };
};
