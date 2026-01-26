import { Show, type Component } from "solid-js";

// Import interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";

const QueueListItem: Component<{
  item: IQueueItem;
  playHandler: () => void;
  dequeueHandler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <li
      data-testId="queue-list-item"
      class="flex items-center justify-between gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-300 dark:text-gray-800"
    >
      <div class="flex w-8/12 flex-col">
        <div class="flex gap-1.5">
          <h4 class="truncate font-semibold">
            {toTitleCase(props.item.title)}
          </h4>
          <Show when={false}>
            <small class="truncate text-sm font-normal">
              ({toTitleCase(props.item.artists?.toString())})
            </small>
          </Show>
        </div>
        <em
          class="truncate text-sm font-normal italic leading-4 text-gray-500"
          innerHTML={toTitleCase(props.item.content[0][0]) || ""}
        ></em>
      </div>
      <button
        type="button"
        title="remove"
        class="material-symbols-outlined rounded-full p-1.5 transition hover:bg-gray-500 hover:text-gray-50"
        onClick={() => props.dequeueHandler()}
      >
        remove_from_queue
      </button>
      <button
        type="button"
        title="play"
        class="material-symbols-outlined rounded-full p-1.5 transition hover:bg-gray-500 hover:text-gray-50"
        onClick={() => props.playHandler()}
      >
        queue_play_next
      </button>
    </li>
  );
};

export default QueueListItem;
