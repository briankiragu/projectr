import { Component } from 'solid-js';
import { ITrack } from '../../interfaces/track';

const QueueListItem: Component<{
  track: ITrack;
  handler: [(id: number | undefined) => void, number | undefined];
}> = (props) => {
  const [fn, args] = props.handler;

  return (
    <div class="mt-2 flex justify-between gap-4 rounded-lg bg-gray-100 px-4 py-2 align-middle text-sm text-gray-600 shadow transition-shadow hover:shadow-md">
      <span class="material-symbols-outlined cursor-move p-1">drag_pan</span>
      <h4 class="col-span-2 w-full py-1 font-semibold">{props.track.title}</h4>
      <button
        class="material-symbols-outlined rounded-full p-1 hover:bg-gray-300"
        onClick={() => fn(args)}
      >
        playlist_remove
      </button>
    </div>
  );
};

export default QueueListItem;
