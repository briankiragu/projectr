import { type Component, For } from 'solid-js';
import type { ITrack } from '@interfaces/track';
import { lazy } from 'solid-js';

const SearchResultsItem = lazy(() => import('@components/search/SearchResultsItem'));

const SearchResults: Component<{
  results: ITrack[];
  handler: (track: ITrack) => void;
}> = (props) => {
  return (
    <div class="flex flex-col gap-2 rounded-md">
      <For each={props.results}>
        {(track) => (
          <SearchResultsItem track={track} handler={[props.handler, track]} />
        )}
      </For>
    </div>
  );
};

export default SearchResults;
