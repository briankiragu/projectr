import { Component, For } from 'solid-js';

const LyricsPreviewCard: Component<{
  verse?: string[];
}> = (props) => {
  return (
    <div class="h-72 rounded-lg bg-teal-600 px-6 py-4 text-teal-50 shadow-lg shadow-teal-600/20 transition-colors">
      <For each={props.verse}>
        {(line) => (
          <p class="text-wrap text-xl font-semibold lg:text-2xl">{line}</p>
        )}
      </For>
    </div>
  );
};

export default LyricsPreviewCard;
