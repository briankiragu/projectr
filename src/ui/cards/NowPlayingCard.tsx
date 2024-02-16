import { Component } from 'solid-js';
import { ITrack } from '../../interfaces/track';

const NowPlayingCard: Component<{
  track?: ITrack;
  handler?: () => void;
}> = (props) => {
  return (
    <div class="flex h-16 items-center truncate rounded-lg bg-cyan-600 px-5 align-middle text-sm shadow-lg shadow-cyan-600/20 lg:px-6 lg:py-4">
      <h4 class="text-wrap text-lg font-extrabold text-teal-50">
        {props.track?.title}
      </h4>
    </div>
  );
};

export default NowPlayingCard;
