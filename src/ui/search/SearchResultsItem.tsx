import { Component } from 'solid-js';
import type { ITrack } from '../../interfaces/track';
import useFormatting from '../../lib/composables/useFormatting';

const SearchResultsItem: Component<{
  track: ITrack;
  handler: [(track: ITrack) => void, ITrack];
}> = (props) => {
  const { toTitleCase } = useFormatting();
  const [fn, args] = props.handler;

  return (
    <div class="flex justify-between gap-4 rounded-lg bg-gray-100 px-4 py-2 align-middle text-sm text-gray-600 shadow transition-shadow hover:shadow-md">
      <h4 class="col-span-2 w-full py-1 font-semibold">
        {toTitleCase(props.track.title)}
      </h4>
      <button
        class="material-symbols-outlined rounded-full p-1 hover:bg-gray-300"
        onClick={() => fn(args)}
      >
        playlist_add
      </button>
    </div>
  );
};

export default SearchResultsItem;
