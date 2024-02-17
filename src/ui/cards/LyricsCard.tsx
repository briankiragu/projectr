import { Component, For } from 'solid-js';

const LyricsCard: Component<{
  verse: string[];
  isActive: boolean;
  handler: () => void;
}> = (props) => {
  return (
    <div
      class="h-32 cursor-pointer truncate rounded-lg border-4 bg-gray-200 px-6 py-4 text-gray-600 shadow-md transition-colors lg:px-4 lg:py-2"
      classList={{
        'border-teal-600 shadow-lg shadow-teal-600/20': props.isActive,
      }}
      onClick={props.handler}
    >
      <For each={props.verse}>
        {(line) => (
          <p class="text-wrap text-xl font-semibold lg:text-sm">{line}</p>
        )}
      </For>
    </div>
  );
};

export default LyricsCard;
