export enum ISource {
  meili = "MeiliSearch",
  musix = "MusixMatch",
}

export enum IStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export type ITrack = {
  id: number;
  title: string;
  lyrics: string[][];

  status?: IStatus;
  sort?: number;

  created_by?: string;
  created_at?: string;

  updated_by?: string;
  updated_at?: string;
};

export interface ISearchItem extends ITrack {
  source: ISource;
}

export interface IQueueItem extends ISearchItem {
  qid: number;
}
