import { type Component } from 'solid-js';
import type { ITrack } from '@interfaces/track';
import useFormatting from '@composables/useFormatting';

const NowPlayingCard: Component<{
  track?: ITrack;
  handler?: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div class="relative flex h-16 items-center truncate rounded-lg bg-green-600 px-5 align-middle text-sm shadow-lg shadow-green-600/20 lg:px-6 lg:py-4">
      <h4 class="w-[90%] text-wrap text-lg font-extrabold text-green-50">
        {toTitleCase(props.track?.title)}
      </h4>

      {/* Enable live edit */}
      <span
        class="material-symbols-outlined cursor-pointer rounded-full p-1.5 transition-colors bg-green-500 hover:bg-green-700 hover:text-green-100"
        onClick={props.handler}
      >
        edit
      </span>
    </div>
  );
};

export default NowPlayingCard;
