import { type Component, For } from 'solid-js';
import type { ITrack } from '@interfaces/track';
import { lazy } from 'solid-js';

const SearchResultsItem = lazy(() => import('@components/search/SearchResultsItem'));

const SearchResults: Component<{
  results: ITrack[];
  handler: (track: ITrack) => void;
}> = (props) => {
  return (
    <div class="flex h-40 flex-col gap-2 overflow-y-scroll rounded-md lg:h-52">
      <For each={props.results}>
        {(track) => (
          <SearchResultsItem track={track} handler={[props.handler, track]} />
        )}
      </For>
    </div>
  );
};

export default SearchResults;
