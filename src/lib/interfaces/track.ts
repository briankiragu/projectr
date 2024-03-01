export type ITrack = {
  id: number;
  title: string;
  lyrics: string[][];

  created_at: string;
  updated_at: string;
  published_at?: string;

  created_by_id: number;
  updated_by_id: number;
};

export interface IQueueItem extends ITrack {
  qid: number;
}
