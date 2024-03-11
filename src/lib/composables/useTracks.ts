// Import the interfaces...
import { ISource, type IQueueItem, type ITrack } from "@interfaces/track";

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

  const toEditableLyrics = (lyrics?: string[][]): string =>
    lyrics
      ? lyrics.reduce((acc1, verse) => {
          const stanza = verse.reduce((acc2, line) => `${acc2}\n${line}`);

          return `${acc1}${stanza}\n\n`;
        }, ``)
      : ``;

  const fromEditable = (track: IQueueItem, string: string): IQueueItem => ({
    ...track,
    lyrics: string
      .split(/\n\n/g)
      .filter((verse) => verse.length)
      .map((verse) => verse.split(/\n/g)),
  });

  return { searchTracks, toEditableLyrics, fromEditable };
};
