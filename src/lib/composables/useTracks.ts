// Import the interfaces...
import { type ISearchItem, ISource, type ILyric } from "@interfaces/lyric";
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
      ...(hits as ILyric[]).map((hit) => ({
        ...hit,
        content: fromEditableLyrics(hit.content),
        artists: hit.artists?.split(";").filter((val) => val),
        source: ISource.meili,
      })),
    ];
  };

  const searchItemToQueueItem = (item: ISearchItem): IQueueItem => ({
    qid: Date.now(),
    title: item.title,
    artists: item.artists,
    content: item.content,
  });

  return { searchTracks, searchItemToQueueItem };
};
