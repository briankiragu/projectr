export enum ITrackParts {
  intro = 'intro',
  preChorus = 'preChorus',
  chorus = 'chorus',
  bridge = 'bridge',
  verses = 'verses',
}

export type ITrack = {
  id?: number;
  title: string;
  lyrics: {
    [ITrackParts.intro]?: string[];
    [ITrackParts.preChorus]?: string[];
    [ITrackParts.chorus]?: string[];
    [ITrackParts.bridge]?: string[];
    [ITrackParts.verses]: Array<string[]>;
  };
};

export type INowPlaying = {
  currentlyShowing: ITrackParts;
  activeVerseIndex: number;
};
