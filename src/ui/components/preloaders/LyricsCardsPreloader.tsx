import { Show } from "solid-js";
import { type Component } from "solid-js";

const LyricsCardsPreloader: Component<{ canProject: boolean }> = (props) => {
  return (
    <div class="flex flex-1 items-center justify-center text-lg font-semibold text-gray-800">
      <Show
        when={props.canProject}
        fallback={
          <div class="flex flex-col items-center justify-center">
            <img src="/images/failed.png" class="h-auto w-44 opacity-90" />
            <span>Failed to identify a second screen</span>
          </div>
        }
      >
        <div class="flex flex-col items-center justify-center">
          <img src="/images/waiting.png" class="h-auto w-32 opacity-90" />
          <span class="text-tvc-orange">No track is currently playing...</span>
        </div>
      </Show>
    </div>
  );
};

export default LyricsCardsPreloader;
