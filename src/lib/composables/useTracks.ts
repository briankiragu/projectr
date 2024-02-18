import { ITrack } from '../../interfaces/track';

export default () => {
  const toEditable = (track: ITrack): string => {
    return ``;
  };

  const fromEditable = (string: string): ITrack => {
    return 'a' as unknown as ITrack;
  };

  return { toEditable, fromEditable };
};
