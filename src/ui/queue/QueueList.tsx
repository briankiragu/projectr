import { Component, For, createEffect, createSignal, lazy } from 'solid-js';

// Import interfaces.
import type { ITrack } from '../../interfaces/track';

// Import the components.
const QueueListItem = lazy(() => import('./QueueListItem'));

const QueueList: Component<{
  queue: ITrack[];
  handler: (id: number | undefined) => void;
}> = ({ queue, handler }) => {
  const [refs] = createSignal<(HTMLDivElement | undefined)[]>([]);

  createEffect(() => {
    console.dir(refs());
  });

  return (
    <div class="flex h-48 flex-col gap-2 overflow-y-scroll rounded-md bg-gray-50/50 lg:h-56">
      <For each={queue.slice(1)}>
        {(track: ITrack) => (
          <QueueListItem track={track} handler={() => handler(track.qid)} />
        )}
      </For>
    </div>
  );
};

export default QueueList;
