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

  const currentVerse = (): string[] | undefined =>
    nowPlaying()?.lyrics.at(currentVerseIndex());

  // When a message relays on the channel.
  channel.addEventListener("message", (e: Event) => {
    const data = JSON.parse((e as MessageEvent).data);

    setNowPlaying(data !== null ? data["nowPlaying"] : undefined);
    setCurrentVerseIndex(data !== null ? data["currentVerseIndex"] : undefined);
  });

  return (
    <div class="flex h-dvh flex-col items-stretch gap-4 bg-gray-100 p-6">
      {/* Title */}
      <Show when={nowPlaying() !== undefined && currentVerseIndex() === 0}>
        <h2 class="text-wrap text-center text-2xl font-black uppercase text-tvc-orange underline md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl">
          {toTitleCase(nowPlaying()?.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <div
        class="flex flex-auto flex-col items-center justify-center gap-2 rounded-lg bg-[url('/images/tvc-logo.svg')] bg-contain bg-center bg-no-repeat text-center text-tvc-green opacity-100 transition-colors"
        classList={{ "bg-none opacity-full": nowPlaying() !== undefined }}
      >
        <Show when={nowPlaying() !== undefined}>
          <For each={currentVerse()}>
            {(line) => (
              <p class="text-wrap text-2xl font-extrabold uppercase md:text-4xl lg:text-6xl">
                {line}
              </p>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default Project;
