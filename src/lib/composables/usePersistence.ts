import type { IQueueItem } from "@interfaces/queue";

const STORE_QUEUE_NAME = "queue";
const STORE_NOW_PLAYING_NAME = "nowPlaying";

export default () => {
  const getStoredQueue = (): IQueueItem[] => {
    const queue = localStorage.getItem(STORE_QUEUE_NAME);

    // Return the data
    return queue ? JSON.parse(queue) : [];
  };

  const setStoredQueue = (items: IQueueItem[]): void =>
    localStorage.setItem(STORE_QUEUE_NAME, JSON.stringify(items));

  const getStoredNowPlaying = (): IQueueItem | undefined => {
    const nowPlaying = localStorage.getItem(STORE_NOW_PLAYING_NAME);

    // Return the data
    return nowPlaying !== null && nowPlaying !== "undefined"
      ? JSON.parse(nowPlaying)
      : undefined;
  };

  const setStoredNowPlaying = (items: IQueueItem | undefined): void =>
    localStorage.setItem(STORE_NOW_PLAYING_NAME, JSON.stringify(items));

  return {
    getStoredQueue,
    setStoredQueue,
    getStoredNowPlaying,
    setStoredNowPlaying,
  };
};
