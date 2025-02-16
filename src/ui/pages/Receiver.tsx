import { type Component, createSignal, Show, For, onMount } from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useProjection from "@composables/useProjection";
import usePresentation from "@composables/usePresentation";

const Receiver: Component = () => {
  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { initialisePresentationReceiver } = usePresentation();
  const { initialiseProjectionReceiver } = useProjection(channel);

  // To hold the data from the broadcast channel.
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>();
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal(0);

  const currentVerse = (): string[] | undefined =>
    nowPlaying()?.content.at(currentVerseIndex());

  const updatePresentation = (message: MessageEvent) => {
    // When a message is relayed on the connection, extract it.
    const data = JSON.parse(message.data);

    setNowPlaying(data !== null ? data["nowPlaying"] : undefined);
    setCurrentVerseIndex(data !== null ? data["currentVerseIndex"] : undefined);
  };

  onMount(() => {
    initialisePresentationReceiver(updatePresentation);
    initialiseProjectionReceiver(updatePresentation);
  });

  return (
    <div class="flex h-dvh flex-col items-stretch gap-4 bg-gray-100 p-6">
      {/* Title */}
      <Show when={nowPlaying() !== undefined && currentVerseIndex() === 0}>
        <h2 class="text-wrap text-center font-serif text-2xl font-black uppercase text-[#D15F20] underline md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl">
          {toTitleCase(nowPlaying()?.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <div
        style={{ "font-size": "1em" }}
        class="flex flex-auto flex-col items-center justify-center gap-2 rounded-lg bg-[url('/images/tvc-logo.svg')] bg-contain bg-center bg-no-repeat text-center text-[#000435] opacity-100 transition-colors 2xl:px-6"
        classList={{ "bg-none opacity-full": nowPlaying() !== undefined }}
      >
        <Show when={nowPlaying() !== undefined}>
          <For each={currentVerse()}>
            {(line) => (
              <div
                class="text-wrap font-serif text-2xl font-black uppercase italic md:text-large lg:text-larger 2xl:mb-8 2xl:text-largest"
                innerHTML={line}
              ></div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default Receiver;
