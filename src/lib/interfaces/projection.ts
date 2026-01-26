import type { IQueueItem } from "@interfaces/queue";

export type IProjection = {
  screen: ScreenDetailed;
  proxy: WindowProxy | undefined;
};

export type IProjectionPayload = {
  nowPlaying: IQueueItem | undefined;
  currentVerseIndex: number;
};

export enum IProjectionScreenTypes {
  audience = "audience",
  prompter = "prompter",
}
