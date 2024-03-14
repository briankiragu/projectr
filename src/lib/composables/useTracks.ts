// Import the interfaces...
import { ISource, type ITrack } from "@interfaces/track";

// Import the composables...
import useMeiliSearch from "@composables/useMeiliSearch";

export default () => {
  // Import the composables.
  const { searchMeiliSearch } = useMeiliSearch();

  const searchTracks = async (phrase: string): Promise<ITrack[]> => {
    // Search MeiliSearch for tracks.
    const { hits } = await searchMeiliSearch(phrase);

    // Return the combined results.
    return [
      ...(hits as ITrack[]).map((hit) => ({ ...hit, source: ISource.meili })),
    ];
  };

  return { searchTracks };
};
