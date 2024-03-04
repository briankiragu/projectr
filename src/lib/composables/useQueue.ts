import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// Import the composables.
import type { IQueueItem, ITrack } from "@interfaces/track";

export default (channel: BroadcastChannel) => {
  const [queue, setQueue] = createStore<IQueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<number>(0);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  // First item in queue (now playing).
  const peek = () => queue.at(0);

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, { qid: Date.now(), ...track }]);
  };

  // Dequeue.
  const dequeue = (qid: number, shouldReset?: boolean) => {
    setQueue(queue.filter((track) => qid !== track.qid));

    // Update now playing when a track is dequeued.
    if (shouldReset) {
      setNowPlaying(0);
      setIsEditing(false);
    }

    // If there is no data in the queue, clear the broadcast.
    if (peek() === undefined) channel.postMessage(null);
  };

  // Clear queue
  const flush = () => setQueue(queue.slice(0, 1));

  /**
   * Set a queued playing song as now playing.
   */
  const playNow = (qid: number) => {
    if (peek()) {
      // Find the item in the queue.
      const track = queue.find((track) => track.qid === qid);

      // Rebuild the queue.
      setQueue([
        peek()!,
        track!,
        ...queue.slice(1).filter((track) => track.qid !== qid),
      ]);

      // Dequeue the first item.
      dequeue(peek()!.qid, true);
    }
  };

  /**
   * Edit the currently playing track lyrics.
   */
  const editNowPlaying = (qid: number, lyrics: string[][]) => {
    // Update an item in the queue.
    setQueue(
      (track) => track.qid === qid,
      "lyrics",
      () => lyrics
    );

    // Toggle live edit
    setIsEditing(false);
  };

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => nowPlaying() === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean => nowPlaying() + 1 === peek()?.lyrics.length;

  // Previous verse.
  const goToPreviousVerse = () => {
    if (!isFirstVerse()) {
      setNowPlaying((nowPlaying) => nowPlaying - 1);
    }
  };

  // Next verse.
  const goToNextVerse = () => {
    if (!isLastVerse()) {
      setNowPlaying((nowPlaying) => nowPlaying + 1);
    }
  };

  // Go to a specific verse.
  const goToVerse = (index: number) => {
    setNowPlaying(index);
  };

  return {
    queue,
    nowPlaying,
    isEditing,

    peek,
    enqueue,
    dequeue,
    flush,

    playNow,
    editNowPlaying,

    isFirstVerse,
    isLastVerse,
    goToPreviousVerse,
    goToNextVerse,
    goToVerse,

    setIsEditing,
  };
};
