import { type Component } from 'solid-js';
import type { ITrack } from '@interfaces/track';
import useFormatting from '@composables/useFormatting';

const SearchResultsItem: Component<{
  track: ITrack;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div class="flex justify-between rounded-lg bg-gray-100 px-4 py-2 items-center text-sm text-gray-600 shadow transition-shadow hover:shadow-md">
      <div class="col-span-2 flex flex-col">
        <h4 class="font-semibold">{toTitleCase(props.track.title)}</h4>
        <span class="text-sm italic font-light">{toTitleCase(props.track.lyrics[0][0])}</span>
      </div>
      <button
        class="material-symbols-outlined rounded-full w-8 h-8 hover:bg-tvc-green hover:text-green-50 transition-colors focus:outline-none"
        onClick={() => props.handler()}
      >
        playlist_add
      </button>
    </div>
  );
};

export default SearchResultsItem;
