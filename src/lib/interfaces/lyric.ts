export enum ISource {
  meili = "MeiliSearch",
  musix = "MusixMatch",
}

export enum IStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export type ILyric = {
  title: string;
  content: string;
  artists?: string;

  status: IStatus;
  sort: number | null;

  created_on?: string;
  created_by?: string;

  updated_on?: string;
  updated_by?: string;
};

export interface ISearchItem extends Omit<ILyric, "content" | "artists"> {
  content: string[][];
  artists?: string[];
  source: ISource;
}
