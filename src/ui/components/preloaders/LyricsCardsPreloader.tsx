import { Show } from "solid-js";
import { type Component } from "solid-js";

const LyricsCardsPreloader: Component<{ canProject: boolean }> = (props) => {
  return (
    <div class="flex flex-1 items-center justify-center text-lg font-semibold text-rose-600">
      <Show
        when={props.canProject}
        fallback={"Failed to identify a second screen"}
      >
        <span class="text-tvc-orange">No track is currently playing...</span>
      </Show>
    </div>
  );
};

export default LyricsCardsPreloader;
