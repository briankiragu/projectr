import { type Component, For, lazy } from 'solid-js';

// Import interfaces.
import type { IQueueItem } from '@interfaces/track';
import useDragAndDropAPI from '@composables/useDragAndDropAPI';

// Import the components.
const QueueListItem = lazy(() => import('./QueueListItem'));

const QueueList: Component<{
  queue: IQueueItem[];
  playHandler: (id: number) => void;
  queueHandler: (id: number) => void;
}> = (props) => {
  const refs: (HTMLDivElement | undefined)[] = [];

  return (
    <div class="flex h-48 flex-col gap-2 overflow-y-scroll rounded-md bg-gray-50/50 lg:h-56">
      <For each={props.queue.slice(1)}>
        {(track: IQueueItem, index) => (
          <QueueListItem
            ref={refs.at(index())}
            track={track}
            dragHandlers={useDragAndDropAPI}
            playHandler={() => props.playHandler(track.qid)}
            queueHandler={() => props.queueHandler(track.qid)}
          />
        )}
      </For>
    </div>
  );
};

export default QueueList;
