import { Show, type Component } from "solid-js";

// Import the interfaces...
import { type ISearchItem } from "@interfaces/lyric";

// Import the composables...
import useFormatting from "@composables/useFormatting";

const LyricsSearchResultsItem: Component<{
  track: ISearchItem;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <li class="flex items-center justify-between gap-5 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-300 dark:text-gray-800">
      <div class="col-span-2 flex flex-col gap-1">
        <div class="div flex flex-col gap-0">
          <h4 class="font-bold">{toTitleCase(props.track.title)}</h4>
          <Show when={props.track.artists?.length}>
            <span
              class="oblique text-xs font-light"
              innerHTML={toTitleCase(props.track.artists?.join(", ")) || ""}
            ></span>
          </Show>
        </div>
        <span
          class="text-sm font-normal italic leading-tight"
          innerHTML={toTitleCase(props.track.content[0][0]) || ""}
        ></span>
      </div>
      <div class="flex items-center justify-end gap-2">
        <img
          src={`/images/${props.track.source.toLowerCase()}-logo.webp`}
          alt={`Sourced from ${props.track.source} logo`}
          class="size-5"
        />
        <button
          class="material-symbols-outlined h-9 w-9 rounded-full p-1.5 transition-colors hover:bg-tvc-orange hover:text-green-50 focus:outline-hidden dark:hover:bg-orange-600"
          onClick={() => props.handler()}
        >
          add_to_queue
        </button>
      </div>
    </li>
  );
};

export default LyricsSearchResultsItem;
