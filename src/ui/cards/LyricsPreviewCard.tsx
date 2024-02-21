import { Component, For } from 'solid-js';

const LyricsPreviewCard: Component<{ verse?: string[] }> = (props) => {
  return (
    <div class="flex min-h-60 flex-col justify-center rounded-lg bg-teal-600 px-6 py-4 text-center text-teal-50 shadow-lg shadow-teal-600/20 transition-colors lg:min-h-72">
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
