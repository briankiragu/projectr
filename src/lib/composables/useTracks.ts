import { ITrack } from '../../interfaces/track';

export default () => {
  const toEditable = (track: ITrack): string => {
    const output = track.lyrics.reduce((acc1, verse) => {
      const stanza = verse.reduce((acc2, line) => `${acc2}\n${line}`);

      return `${acc1}${stanza}\n\n`;
    }, ``);

    console.log(output);
    return output;
  };

  const fromEditable = (string: string): ITrack => {
    return 'a' as unknown as ITrack;
  };

  return { toEditable, fromEditable };
};
