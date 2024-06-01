import { type Component, Show } from "solid-js";

// Import the interfaces...
import { type ISearchItem, ISource } from "@interfaces/lyric";

// Import the composables...
import useFormatting from "@composables/useFormatting";

const LyricsSearchResultsItem: Component<{
  track: ISearchItem;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <li class="flex items-center justify-between gap-5 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow transition-shadow hover:shadow-md dark:bg-gray-300 dark:text-gray-800">
      <div class="col-span-2 flex flex-col">
        <h4 class="font-semibold">{toTitleCase(props.track.title)}</h4>
        <span class="text-sm font-light italic">
          {toTitleCase(props.track.content[0][0])}
        </span>
      </div>
      <div class="flex items-center justify-end gap-2">
        <img
          src={`/images/${props.track.source.toLowerCase()}-logo.webp`}
          alt={`Sourced from ${props.track.source} logo`}
          class="size-5"
        />
        <button
          class="material-symbols-outlined h-9 w-9 rounded-full p-1.5 transition-colors hover:bg-tvc-orange hover:text-green-50 focus:outline-none dark:hover:bg-orange-600"
          onClick={() => props.handler()}
        >
          add_to_queue
        </button>
      </div>
    </li>
  );
};

export default LyricsSearchResultsItem;
