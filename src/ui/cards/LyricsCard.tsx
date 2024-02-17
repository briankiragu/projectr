import { Component, For } from 'solid-js';

const LyricsCard: Component<{
  verse: string[];
  isActive: boolean;
  handler: [(index: number) => void, number];
}> = (props) => {
  const [fn, args] = props.handler;

  return (
    <div
      class="cursor-pointer rounded-lg bg-gray-200 px-6 py-4 text-gray-600 shadow-md transition-colors"
      classList={{
        'bg-teal-600 shadow-lg shadow-teal-600/60 text-teal-50': props.isActive,
      }}
      onClick={() => fn(args)}
    >
      <For each={props.verse}>
        {(line) => (
          <p class="text-wrap text-xl font-semibold lg:text-4xl">{line}</p>
        )}
      </For>
    </div>
  );
};

export default LyricsCard;
