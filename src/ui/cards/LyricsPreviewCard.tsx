import { Component, For } from 'solid-js';

// Import composables.
import usePermissions from '../../lib/composables/usePermissions';

const LyricsPreviewCard: Component<{
  verse?: string[];
}> = (props) => {
  const { requestWindowManagementPermissions } = usePermissions();

  return (
    <div class="relative flex min-h-60 flex-col justify-center rounded-lg bg-teal-600 px-6 py-4 text-center text-teal-50 shadow-lg shadow-teal-600/20 transition-colors lg:min-h-72">
      <span
        class="material-symbols-outlined absolute right-2 top-2 cursor-pointer rounded-full p-1.5 transition-colors hover:bg-teal-700"
        onClick={requestWindowManagementPermissions}
      >
        screen_share
      </span>

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
