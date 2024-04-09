import { onMount, type Component } from "solid-js";

// Import interfaces.
import type { IQueueItem } from "@interfaces/queue";

// Import composables.
import useFormatting from "@composables/useFormatting";
import { type IDragHandlers } from "@composables/apis/useDragAndDropAPI";

const QueueListItem: Component<{
  track: IQueueItem;
  dragHandlers: () => IDragHandlers;
  playHandler: () => void;
  queueHandler: () => void;
}> = (props) => {
  let ref: HTMLDivElement;

  const { toTitleCase } = useFormatting();
  const { onDragOver, onDragStart } = props.dragHandlers();

  onMount(() => {
    ref.addEventListener("dragstart", onDragStart);
    ref.addEventListener("dragover", onDragOver);
  });

  return (
    <div
      ref={ref!}
      draggable="true"
      class="flex min-h-14 items-center justify-between gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 shadow transition-shadow hover:shadow-md"
    >
      <h4 class="col-span-2 w-full py-1 font-semibold">
        {toTitleCase(props.track.title)}
      </h4>
      <button
        class="material-symbols-outlined rounded-full p-1.5 transition hover:bg-gray-500 hover:text-gray-50"
        onClick={() => props.playHandler()}
      >
        play_arrow
      </button>
      <button
        class="material-symbols-outlined rounded-full p-1.5 transition hover:bg-gray-500 hover:text-gray-50"
        onClick={() => props.queueHandler()}
      >
        remove_from_queue
      </button>
    </div>
  );
};

export default QueueListItem;
