import { Component, For, createSignal } from 'solid-js';

const LyricsProjectionCard: Component = () => {
  const [verse] = createSignal<string[]>([
    'When the music fades,',
    'All is stripped away,',
    'And I simply come,',
  ]);

  return (
    <div class="h-screen p-8">
      <div class="relative flex h-full flex-col justify-center gap-8 rounded-lg bg-teal-600 p-4 text-center text-teal-50 shadow-lg shadow-teal-600/20">
        <For each={verse()}>
          {(line) => (
            <p class="text-wrap text-5xl font-extrabold uppercase lg:text-7xl">
              {line}
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

export default LyricsProjectionCard;
