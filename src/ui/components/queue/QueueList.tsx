import { type Component, For, lazy } from "solid-js";

// Import interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useDragAndDropAPI from "@composables/apis/useDragAndDropAPI";

// Import the components.
const QueueListItem = lazy(() => import("@components/queue/QueueListItem"));

const QueueList: Component<{
  queue: IQueueItem[];
  playHandler: (id: number) => void;
  queueHandler: (id: number) => void;
}> = (props) => {
  const refs: (HTMLDivElement | undefined)[] = [];

  return (
    <div class="flex flex-col gap-2 rounded-md">
      <For each={props.queue}>
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
