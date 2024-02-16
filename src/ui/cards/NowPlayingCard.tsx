import { Component } from 'solid-js';
import { ITrack } from '../../interfaces/track';

const NowPlayingCard: Component<{
  track?: ITrack;
  handler?: () => void;
}> = (props) => {
  return (
    <div class="flex h-16 items-center truncate rounded-lg bg-gray-100 px-5 align-middle text-sm shadow-lg shadow-red-600/20 lg:px-6 lg:py-4">
      <h4 class="text-wrap text-lg font-extrabold text-gray-800 lg:text-2xl">
        {props.track?.title}
      </h4>
    </div>
  );
};

export default NowPlayingCard;
