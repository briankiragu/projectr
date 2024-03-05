import { type Component, For } from 'solid-js';

const LyricsCard: Component<{
  verse: string[];
  isActive: boolean;
  handler: () => void;
}> = (props) => {
  return (
    <div
      class="cursor-pointer rounded-lg border-4 bg-gray-200 px-6 py-4 text-gray-600 shadow-md transition-colors lg:px-4 lg:py-2"
      classList={{
        'border-tvc-green bg-tvc-green text-green-50 shadow-lg shadow-tvc-green/20': props.isActive,
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
