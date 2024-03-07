import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// Import the interfaces.
import type { IQueueItem, ITrack } from "@interfaces/track";

export default (channel: BroadcastChannel) => {
  const [queue, setQueue] = createStore<IQueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>(
    undefined
  );
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal<number>(0);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  // First item in queue (now playing).
  const peek = () => queue.at(0);

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, { qid: Date.now(), ...track }]);
  };

  // Dequeue.
  const dequeue = (qid: number) => {
    setQueue(queue.filter((track) => qid !== track.qid));
  };

  // Clear queue
  const flush = () => setQueue([]);

  /**
   * Set a queued playing song as now playing.
   */
  const playNow = (qid: number) => {
    // Find the item in the queue.
    const track = queue.find((track) => track.qid === qid);

    // Set the current now playing.
    setNowPlaying(track);

    // Update the queue.
    dequeue(qid);

    // Reset the verse and editing.
    setCurrentVerseIndex(0);
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  const playNext = () => {
    // Find the item in the queue.
    const track = peek();

    // Set the current now playing.
    setNowPlaying(track);

    if (track !== undefined) {
      // Update the queue.
      dequeue(track.qid);
    }

    // Reset the verse and editing.
    setCurrentVerseIndex(0);
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  /**
   * Edit the currently playing track lyrics.
   */
  const editLyrics = (track: IQueueItem) => {
    // Edit the now playing track.
    setNowPlaying(track);

    // Toggle live edit
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => currentVerseIndex() === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean =>
    currentVerseIndex() + 1 === nowPlaying()?.lyrics.length;

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

  // Send the data over the channel.
  const broadcast = () => {
    // Declare a variable to hold the outgoing data.
    const data =
      nowPlaying() !== undefined
        ? JSON.stringify({
            nowPlaying: nowPlaying(),
            currentVerseIndex: currentVerseIndex(),
          })
        : null;

    // Send the message.
    channel.postMessage(data);
  };

  return {
    queue,
    nowPlaying,
    isEditing,
    currentVerseIndex,

    enqueue,
    dequeue,
    flush,

    playNow,
    playNext,

    setIsEditing,
    editLyrics,

    isFirstVerse,
    isLastVerse,
    goToPreviousVerse,
    goToNextVerse,
    goToVerse,

    broadcast,
  };
};
