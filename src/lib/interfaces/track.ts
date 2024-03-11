export enum ISource {
  meili = "MeiliSearch",
  musix = "MusixMatch",
}

export type ITrack = {
  id: number;
  title: string;
  lyrics: string[][];

  created_at?: string;
  updated_at?: string;
  published_at?: string;

  created_by_id?: number;
  updated_by_id?: number;
};

export interface ISearchItem extends ITrack {
  source: ISource;
}

export interface IQueueItem extends ISearchItem {
  qid: number;
}
