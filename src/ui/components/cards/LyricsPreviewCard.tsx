import { type Component, For } from 'solid-js';

const LyricsPreviewCard: Component<{ verse?: string[] }> = (props) => {
  return (
    <div class="flex h-full flex-col justify-center gap-4 rounded-lg bg-green-900 px-6 py-4 text-center text-teal-50 shadow-lg shadow-teal-600/20 transition-colors lg:min-h-72">
      <For each={props.verse}>
        {(line) => (
          <p class="text-wrap text-2xl font-extrabold uppercase lg:text-6xl 2xl:text-9xl">
            {line}
          </p>
        )}
      </For>
    </div>
  );
};

export default LyricsPreviewCard;
