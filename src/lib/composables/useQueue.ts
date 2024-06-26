import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// Import the interfaces.
import type { IQueueItem } from "@interfaces/queue";

export default () => {
  const [queue, setQueue] = createStore<IQueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>(
    undefined
  );
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal<number>(0);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  // First item in queue.
  const peek = () => queue.at(0);

  // Enqueue.
  const enqueue = (track: IQueueItem) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, track]);
  };

  // Dequeue.
  const dequeue = (qid?: number) => {
    setQueue(
      queue.filter((track, index) =>
        qid === undefined ? index !== 0 : qid !== track.qid
      )
    );
  };

  // Clear queue
  const flush = () => setQueue([]);

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => currentVerseIndex() === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean =>
    currentVerseIndex() + 1 === nowPlaying()?.content.length;

  // Previous verse.
  const goToPreviousVerse = () => {
    if (!isFirstVerse()) {
      setCurrentVerseIndex((currentVerseIndex) => currentVerseIndex - 1);
    }
  };

  // Next verse.
  const goToNextVerse = () => {
    if (!isLastVerse()) {
      setCurrentVerseIndex((currentVerseIndex) => currentVerseIndex + 1);
    }
  };

  // Go to a specific verse.
  const goToVerse = (index: number) => {
    setCurrentVerseIndex(index);
  };

  return {
    queue,
    nowPlaying,
    isEditing,
    currentVerseIndex,

    setQueue,
    setNowPlaying,
    setIsEditing,
    setCurrentVerseIndex,

    peek,
    enqueue,
    dequeue,
    flush,

    isFirstVerse,
    isLastVerse,
    goToPreviousVerse,
    goToNextVerse,
    goToVerse,
  };
};
