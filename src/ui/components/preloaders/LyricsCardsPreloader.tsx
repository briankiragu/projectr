import { Show } from "solid-js";
import { type Component } from "solid-js";

const LyricsCardsPreloader: Component<{ canProject: boolean }> = (props) => {
  return (
    <div class="flex flex-1 items-center justify-center text-center text-lg font-semibold tracking-tight text-gray-800">
      <Show
        when={props.canProject}
        fallback={
          <div class="flex flex-col items-center justify-center gap-4">
            <img
              src="/images/failed.webp"
              alt="Failed to identify second screen"
              class="h-auto w-44 opacity-90"
            />

            <h3 class="dark:text-gray-200">
              Failed to identify a second screen.
            </h3>
          </div>
        }
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <img
            src="/images/waiting.webp"
            alt="No items in queue"
            class="h-auto w-32 opacity-90"
          />
          <h3 class="dark:text-gray-200">
            Waiting for content to be queued...
          </h3>
        </div>
      </Show>
    </div>
  );
};

export default LyricsCardsPreloader;
