import { type Component, For, lazy } from "solid-js";

// Import the interfaces...
import type { ISearchItem } from "@interfaces/lyric";
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useTracks from "@composables/useTracks";

// Import the components...
const LyricsSearchResultsItem = lazy(
  () => import("@components/search/lyrics/LyricsSearchResultsItem")
);

const LyricsSearchResults: Component<{
  results: ISearchItem[];
  enqueueHandler: (track: IQueueItem) => void;
}> = (props) => {
  const { searchItemToQueueItem } = useTracks();

  return (
    <ul class="flex grow flex-col gap-2 overflow-y-scroll rounded-md">
      <For each={props.results}>
        {(track) => (
          <LyricsSearchResultsItem
            track={track}
            handler={() => props.enqueueHandler(searchItemToQueueItem(track))}
          />
        )}
      </For>
    </ul>
  );
};

export default LyricsSearchResults;
