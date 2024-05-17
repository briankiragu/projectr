import { Show } from "solid-js";
import { type Component } from "solid-js";

const LyricsCardsPreloader: Component<{ canProject: boolean }> = (props) => {
  return (
    <div class="flex flex-1 items-center justify-center text-lg font-semibold tracking-tight text-gray-800">
      <Show
        when={props.canProject}
        fallback={
          <div class="flex flex-col items-center justify-center">
            <img src="/images/failed.png" class="h-auto w-44 opacity-90" />

            <h3>Failed to identify/project onto a second screen.</h3>
          </div>
        }
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <img src="/images/waiting.png" class="h-auto w-32 opacity-90" />
          <h3>No track is currently playing</h3>
        </div>
      </Show>
    </div>
  );
};

export default LyricsCardsPreloader;
