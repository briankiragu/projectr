import { type Component, createSignal, Show, For } from 'solid-js';

// Import the interfaces
import type { IQueueItem } from '@interfaces/track';

// Import the composables.
import useFormatting from '@composables/useFormatting';

const Project: Component = () => {
  // Import the composables.
  const { toTitleCase } = useFormatting();

  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // To hold the data from the broadcast channel.
  const [track, setTrack] = createSignal<IQueueItem | undefined>();
  const [nowPlaying, setNowPlaying] = createSignal(0);

  const currentVerse = (): string[] | undefined => track()?.lyrics.at(nowPlaying())

  // When a message relays on the channel.
  broadcast.addEventListener('message', (e: Event) => {
    const data = JSON.parse((e as MessageEvent).data);

    setTrack(data ? data['track'] : null);
    setNowPlaying(data ? data['nowPlaying'] : null);
  });

  return (
    <div class="flex flex-col gap-4 items-stretch h-dvh p-4 bg-gray-100">
      {/* Title */}
      <Show
        when={track()}
        fallback={<div class="h-20 rounded-md bg-gray-200/60"></div>}
      >
        <h2 class="min-h-20 text-center text-wrap text-5xl lg:text-7xl 2xl:text-9xl underline font-black text-tvc-green uppercase">
          {toTitleCase(track()!.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <Show
        when={track()}
        fallback={
          <div
            class="m-6 md:m-10 lg:m-20 bg-contain bg-center bg-no-repeat bg-[url('/images/tvc-logo.svg')] opacity-25 rounded-lg flex-auto flex justify-center align-middle"
          ></div>
        }
      >
        <div class="flex-auto flex flex-col justify-center gap-4 rounded-lg px-6 py-4 text-center text-tvc-orange shadow-lg shadow-teal-600/20 transition-colors">
          <For each={currentVerse()}>
            {(line) => (
              <p class="text-wrap font-extrabold uppercase text-4xl lg:text-7xl 2xl:text-9xl">
                {line}
              </p>
            )}
          </For>
        </div>
      </Show >
    </div >
  );
};

export default Project;
