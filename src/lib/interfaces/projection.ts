import type { IQueueItem } from "@interfaces/queue";

export type IProjectionPayload = {
  nowPlaying: IQueueItem | undefined;
  currentVerseIndex: number;
};
