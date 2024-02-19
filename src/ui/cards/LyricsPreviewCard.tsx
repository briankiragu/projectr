import { Component, For, Show } from 'solid-js';
import useWindowManagement from '../../lib/composables/useWindowManagement';

const LyricsPreviewCard: Component<{
  verse?: string[];
  handler: () => void;
}> = (props) => {
  // Import the composable property.
  const { isSupported } = useWindowManagement();

  return (
    <div class="relative flex min-h-60 flex-col justify-center rounded-lg bg-teal-600 px-6 py-4 text-center text-teal-50 shadow-lg shadow-teal-600/20 transition-colors lg:min-h-72">
      <Show when={isSupported}>
        <span
          class="material-symbols-outlined absolute right-2 top-2 cursor-pointer rounded-full bg-teal-700/50 p-2 transition-colors hover:bg-teal-700"
          onClick={props.handler}
        >
          screen_share
        </span>
      </Show>

      <For each={props.verse}>
        {(line) => (
          <p class="text-wrap text-xl font-semibold uppercase lg:text-2xl">
            {line}
          </p>
        )}
      </For>
    </div>
  );
};

export default LyricsPreviewCard;
