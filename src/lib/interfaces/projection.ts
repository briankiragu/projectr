import type { IQueueItem } from "@interfaces/queue";

export type IPresentationPayload = {
  nowPlaying: IQueueItem | undefined;
  currentVerseIndex: number;
};
