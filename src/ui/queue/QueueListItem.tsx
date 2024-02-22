import { Component } from 'solid-js';

// Import interfaces.
import type { ITrack } from '../../interfaces/track';

// Import composables.
import useFormatting from '../../lib/composables/useFormatting';

const QueueListItem: Component<{
  ref?: HTMLDivElement;
  track: ITrack;
  handler: () => void;
}> = ({ ref, track, handler }) => {
  const { toTitleCase } = useFormatting();

  return (
    <div
      ref={ref}
      draggable="true"
      class="flex justify-between gap-4 rounded-lg bg-gray-100 px-4 py-2 align-middle text-sm text-gray-600 shadow transition-shadow hover:shadow-md"
    >
      <span class="material-symbols-outlined cursor-move p-1">drag_pan</span>
      <h4 class="col-span-2 w-full py-1 font-semibold">
        {toTitleCase(track.title)}
      </h4>
      <button
        class="material-symbols-outlined rounded-full p-1 hover:bg-gray-300"
        onClick={handler}
      >
        playlist_remove
      </button>
    </div>
  );
};

export default QueueListItem;
