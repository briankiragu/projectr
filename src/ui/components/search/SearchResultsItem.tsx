import { type Component, Show } from 'solid-js';

// Import the interfaces...
import { ISource, type ITrack } from '@interfaces/track';

// Import the composables...
import useFormatting from '@composables/useFormatting';

const SearchResultsItem: Component<{
  track: ITrack;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div class="flex gap-5 justify-between rounded-lg bg-gray-100 px-4 py-2 items-center text-sm text-gray-600 shadow transition-shadow hover:shadow-md">
      <div class="col-span-2 flex flex-col">
        <h4 class="font-semibold">{toTitleCase(props.track.title)}</h4>
        <span class="text-sm italic font-light">{toTitleCase(props.track.lyrics[0][0])}</span>
      </div>
      <div class="flex justify-end items-center gap-1.5">
        <Show when={props.track.source !== ISource.meili}>
          <img
            src={`/images/${props.track.source}-logo.webp`}
            alt={`Sourced from ${props.track.source} logo`}
            class="w-5 h-5"
          />
        </Show>
        <button
          class="material-symbols-outlined rounded-full w-9 h-9 p-1.5 hover:bg-tvc-orange hover:text-green-50 transition-colors focus:outline-none"
          onClick={() => props.handler()}
        >
          add_to_queue
        </button>
      </div>
    </div>
  );
};

export default SearchResultsItem;
