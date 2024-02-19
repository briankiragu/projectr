import { Component, For, createSignal } from 'solid-js';

const LyricsProjectionCard: Component = () => {
  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // To hold the data from the broadcast channel.
  const [verse, setVerse] = createSignal<string[]>([]);

  // When a message relays on the channel.
  broadcast.addEventListener('message', (e: Event) => {
    const data = JSON.parse((e as MessageEvent).data);
    setVerse(data);
  });

  return (
    <div class="h-screen p-4">
      <div class="relative flex h-full flex-col justify-center gap-4 rounded-lg bg-teal-600 p-4 text-center text-teal-50 shadow-lg shadow-teal-600/20">
        <For each={verse()}>
          {(line) => (
            <p class="text-wrap text-5xl font-extrabold uppercase lg:text-5xl">
              {line}
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

export default LyricsProjectionCard;
