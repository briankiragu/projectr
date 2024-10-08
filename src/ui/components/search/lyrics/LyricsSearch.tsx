import { Show, type Component, lazy } from "solid-js";

// Import the interfaces...
import type { ISearchItem } from "@interfaces/lyric";
import type { IQueueItem } from "@interfaces/queue";

// Import the components...
import LyricsSearchForm from "@components/search/lyrics/LyricsSearchForm";
const LyricsSearchResults = lazy(
  () => import("@components/search/lyrics/LyricsSearchResults")
);

const LyricsSearch: Component<{
  results: ISearchItem[];
  searchHandler: (results: ISearchItem[]) => void;
  enqueueHandler: (item: IQueueItem) => void;
}> = (props) => {
  // Create the derived signals.
  const hasResults = (): boolean => props.results.length > 0;

  return (
    <div
      data-testId="lyrics-search"
      class="flex grow flex-col gap-2.5 bg-pink-400"
    >
      {/* Search Form */}
      <LyricsSearchForm searchHandler={props.searchHandler} />

      {/* Search results */}
      <div class="flex-initial grow overflow-y-scroll rounded-md transition">
        <Show when={hasResults()}>
          <LyricsSearchResults
            results={props.results}
            enqueueHandler={props.enqueueHandler}
          />
        </Show>
      </div>
    </div>
  );
};

export default LyricsSearch;
