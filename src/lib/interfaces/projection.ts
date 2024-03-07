import type { IQueueItem } from "@interfaces/track";

export type IProjectionPayload = {
  nowPlaying: IQueueItem | undefined;
  currentVerseIndex: number;
};
