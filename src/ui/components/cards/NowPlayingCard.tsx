import { type Component } from 'solid-js';
import type { IQueueItem } from '@interfaces/track';
import useFormatting from '@composables/useFormatting';

const NowPlayingCard: Component<{
  track: IQueueItem;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div class="relative flex min-h-16 items-center truncate rounded-lg bg-tvc-green px-5 align-middle text-sm shadow-lg shadow-tvc-green/20 md:px-4 xl:px-4">
      <h4 class="w-[90%] text-wrap text-lg md:text-sm xl:text-lg font-extrabold text-green-50">
        {toTitleCase(props.track.title)}
      </h4>

      {/* Enable live edit */}
      <span
        class="material-symbols-outlined cursor-pointer rounded-full p-1.5 transition-colors bg-tvc-green hover:bg-tvc-orange hover:text-orange-100"
        onClick={() => props.handler()}
      >
        edit
      </span>
    </div>
  );
};

export default NowPlayingCard;
