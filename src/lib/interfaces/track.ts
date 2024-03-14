export enum ISource {
  meili = "MeiliSearch",
  musix = "MusixMatch",
}

export enum IStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export type ITrack = {
  title: string;
  lyrics: string;
};

export interface ISearchItem extends Omit<ITrack, "lyrics"> {
  lyrics: string[][];
  source: ISource;
}

export interface IQueueItem extends ISearchItem {
  qid: number;
}
