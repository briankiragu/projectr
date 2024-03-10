import { onMount, type Component } from 'solid-js';

// Import interfaces.
import type { IQueueItem } from '@interfaces/track';

// Import composables.
import useFormatting from '@composables/useFormatting';
import { type IDragHandlers } from '@composables/useDragAndDropAPI';

const QueueListItem: Component<{
  track: IQueueItem;
  dragHandlers: () => IDragHandlers;
  playHandler: () => void;
  queueHandler: () => void;
}> = (props) => {
  let ref: HTMLDivElement | undefined;

  const { toTitleCase } = useFormatting();
  const { onDragOver, onDragStart } = props.dragHandlers();

  onMount(() => {
    ref?.addEventListener('dragstart', onDragStart);
    ref?.addEventListener('dragover', onDragOver);
  });

  return (
    <div
      ref={ref}
      draggable="true"
      class="min-h-14 flex justify-between gap-2 rounded-lg bg-gray-100 px-4 py-2 items-center text-sm text-gray-600 shadow transition-shadow hover:shadow-md"
    >
      {/* <span class="material-symbols-outlined cursor-move p-1">drag_pan</span> */}
      <h4 class="col-span-2 w-full py-1 font-semibold">
        {toTitleCase(props.track.title)}
      </h4>
      <button
        class="material-symbols-outlined rounded-full px-0.5 py-0.5 hover:bg-gray-300"
        onClick={() => props.playHandler()}
      >
        play_arrow
      </button>
      <button
        class="material-symbols-outlined rounded-full px-0.5 py-0.5 hover:bg-gray-300"
        onClick={() => props.queueHandler()}
      >
        playlist_remove
      </button>
    </div>
  );
};

export default QueueListItem;
