import { type Component, For, lazy } from "solid-js";

// Import interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the components.
const QueueListItem = lazy(() => import("@components/queue/QueueListItem"));

const QueueList: Component<{
  queue: IQueueItem[];
  playHandler: (id: number) => void;
  queueHandler: (id: number) => void;
}> = (props) => (
  <div data-testId="queue-list" class="flex flex-col gap-2 rounded-md">
    <For each={props.queue}>
      {(track: IQueueItem) => (
        <QueueListItem
          item={track}
          playHandler={() => props.playHandler(track.qid)}
          dequeueHandler={() => props.queueHandler(track.qid)}
        />
      )}
    </For>
  </div>
);

export default QueueList;
