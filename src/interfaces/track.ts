export type ITrack = {
  title: string;
  lyrics: {
    intro?: string[];
    preChorus?: string[];
    chorus?: string[];
    bridge?: string[];
    verses: Array<string[]>;
  };
};
