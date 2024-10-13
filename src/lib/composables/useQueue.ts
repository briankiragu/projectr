import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// Import the interfaces.
import type { IQueueItem } from "@interfaces/queue";

// Import the composables.
import usePersistence from "@composables/usePersistence";

export default () => {
  // Import the composables
  const { getStoredQueue, setStoredQueue, getStoredNowPlaying } =
    usePersistence();

  // Define the reactive variables.
  const [queue, setQueue] = createStore<IQueueItem[]>(getStoredQueue());
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>(
    getStoredNowPlaying()
  );
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal<number>(0);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  // First item in queue.
  const peek = () => queue.at(0);

  // Enqueue.
  const enqueue = (track: IQueueItem) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, track]);

    // Update the persistent state.
    setStoredQueue(queue);
  };

  // Dequeue.
  const dequeue = (qid?: number) => {
    setQueue(
      queue.filter((track, index) =>
        qid === undefined ? index !== 0 : qid !== track.qid
      )
    );

    // Update the persistent state.
    setStoredQueue(queue);
  };

  // Clear queue
  const flush = () => {
    setQueue([]);

    // Update the persistent state.
    setStoredQueue(queue);
  };

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
