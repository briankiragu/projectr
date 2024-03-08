import { type Component, createSignal, Show, For } from "solid-js";

// Import the interfaces
import type { IQueueItem } from "@interfaces/track";

// Import the composables.
import useFormatting from "@composables/useFormatting";

const Project: Component = () => {
  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Import the composables.
  const { toTitleCase } = useFormatting();

  // To hold the data from the broadcast channel.
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>();
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal(0);

  const currentVerse = (): string[] | undefined => nowPlaying()?.lyrics.at(currentVerseIndex())

  // When a message relays on the channel.
  channel.addEventListener("message", (e: Event) => {
    const data = JSON.parse((e as MessageEvent).data);

    setNowPlaying(data !== null ? data["nowPlaying"] : undefined);
    setCurrentVerseIndex(data !== null ? data["currentVerseIndex"] : undefined);
  });

  return (
    <div class="flex flex-col gap-4 items-stretch h-dvh p-6 bg-gray-100">
      {/* Title */}
      <Show
        when={nowPlaying() !== undefined}
        fallback={<div class="h-20 rounded-md bg-gray-200/60"></div>}
      >
        <h2 class="min-h-20 text-center text-wrap text-2xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl underline font-black text-tvc-green uppercase">
          {toTitleCase(nowPlaying()?.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <div
        class="m-6 md:m-10 xl:m-20 bg-contain bg-center bg-no-repeat bg-[url('/images/tvc-logo.svg')] opacity-100 flex-auto flex align-middle flex-col justify-center gap-4 rounded-lg px-6 py-4 text-center text-tvc-orange transition-colors"
        classList={{ 'bg-none opacity-full': nowPlaying() !== undefined }}
      >
        <Show
          when={nowPlaying() !== undefined}>
          <For each={currentVerse()}>
            {(line) => (
              <p class="text-wrap font-extrabold uppercase text-2xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-9xl">
                {line}
              </p>
            )}
          </For>
        </Show>
      </div>
    </div >
  );
};

export default Project;
