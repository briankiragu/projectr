// Import the interfaces...
import { type ISearchItem, ISource, type ITrack } from "@interfaces/track";
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useMeiliSearch from "@composables/apis/useMeiliSearch";

export default () => {
  // Import the composables.
  const { fromEditableLyrics } = useFormatting();
  const { searchMeiliSearch } = useMeiliSearch();

  const searchTracks = async (phrase: string): Promise<ISearchItem[]> => {
    // Search MeiliSearch for tracks.
    const { hits } = await searchMeiliSearch(phrase);

    // Return the combined results.
    return [
      ...(hits as ITrack[]).map((hit) => ({
        ...hit,
        lyrics: fromEditableLyrics(hit.lyrics),
        source: ISource.meili,
      })),
    ];
  };

  const searchItemToQueueItem = (item: ISearchItem): IQueueItem => ({
    qid: Date.now(),
    title: item.title,
    content: item.lyrics,
  });

  return { searchTracks, searchItemToQueueItem };
};
