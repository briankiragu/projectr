import type { IQueueItem } from "@interfaces/queue";

export type IProjection = {
  screen: ScreenDetailed;
  proxy: WindowProxy | undefined;
};

export type IProjectionPayload = {
  queue: IQueueItem[];
  currentVerseIndex: number;
};
