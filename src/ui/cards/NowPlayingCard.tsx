import { Component } from 'solid-js';
import { ITrack } from '../../interfaces/track';
import useFormatting from '../../lib/composables/useFormatting';

const NowPlayingCard: Component<{
  track?: ITrack;
  handler?: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div class="relative flex h-16 items-center truncate rounded-lg bg-cyan-600 px-5 align-middle text-sm shadow-lg shadow-cyan-600/20 lg:px-6 lg:py-4">
      {/* Enable live edit */}
      <span
        class="material-symbols-outlined absolute right-3 top-3 cursor-pointer rounded-full p-1.5 transition-colors hover:bg-teal-700/40"
        onClick={props.handler}
      >
        edit
      </span>

      <h4 class="text-wrap text-lg font-extrabold text-teal-50">
        {toTitleCase(props.track?.title)}
      </h4>
    </div>
  );
};

export default NowPlayingCard;
