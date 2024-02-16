import { Component, For } from 'solid-js';
import { ITrack } from '../../interfaces/track';
import SearchResultsItem from './SearchResultsItem';

const SearchResults: Component<{
  results: ITrack[];
  handler: (track: ITrack) => void;
}> = (props) => {
  return (
    <div class="mt-3 h-40 overflow-y-scroll lg:h-52">
      <For each={props.results}>
        {(track) => (
          <SearchResultsItem track={track} handler={[props.handler, track]} />
        )}
      </For>
    </div>
  );
};

export default SearchResults;
