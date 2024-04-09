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

  status: IStatus;
  sort: number | null;

  created_on?: string;
  created_by?: string;

  updated_on?: string;
  updated_by?: string;
};

export interface ISearchItem extends Omit<ITrack, "lyrics"> {
  lyrics: string[][];
  source: ISource;
}
