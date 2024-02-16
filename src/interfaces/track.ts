export type ITrack = {
  id?: number;
  title: string;
  lyrics: {
    intro?: string[];
    preChorus?: string[];
    chorus?: string[];
    bridge?: string[];
    verses: Array<string[]>;
  };
};

export type INowPlaying = {
  track?: ITrack;
  activeVerseIndex: number;
};
