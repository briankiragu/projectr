import { Component, For } from 'solid-js';

// Import interfaces.
import type { ITrack } from '../../interfaces/track';

// Import the components.
import QueueListItem from './QueueListItem';

const QueueList: Component<{
  queue: ITrack[];
  handler: (id: number | undefined) => void;
}> = (props) => {
  return (
    <div class="flex h-48 flex-col gap-2 overflow-y-scroll rounded-md bg-gray-50/50 lg:h-56">
      <For each={props.queue.slice(1)}>
        {(track: ITrack) => (
          <QueueListItem
            track={track}
            handler={() => props.handler(track.id)}
          />
        )}
      </For>
    </div>
  );
};

export default QueueList;
