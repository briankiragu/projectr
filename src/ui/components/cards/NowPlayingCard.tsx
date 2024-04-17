import { type Component } from "solid-js";
import type { IQueueItem } from "@interfaces/queue";
import useFormatting from "@composables/useFormatting";

const NowPlayingCard: Component<{
  item: IQueueItem;
  handler: () => void;
}> = (props) => {
  const { toTitleCase } = useFormatting();

  return (
    <div
      data-testid="now-playing-card"
      class="relative flex min-h-16 items-center truncate rounded-lg bg-tvc-green px-5 align-middle text-sm shadow-lg shadow-tvc-green/20 md:px-4 xl:px-4"
    >
      <h4 class="w-[90%] text-wrap text-lg font-extrabold text-green-50 md:text-sm xl:text-lg">
        {toTitleCase(props.item.title)}
      </h4>

      {/* Enable live edit */}
      <button
        class="material-symbols-outlined cursor-pointer rounded-full bg-tvc-green p-1.5 transition-colors hover:bg-tvc-orange hover:text-orange-100"
        onClick={() => props.handler()}
      >
        edit
      </button>
    </div>
  );
};

export default NowPlayingCard;
