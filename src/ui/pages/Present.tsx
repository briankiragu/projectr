import { type Component, Show, For, onMount } from "solid-js";

// Import the interfaces...
import type { IProjectionPayload } from "@interfaces/projection";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useProjection from "@composables/useProjection";
import usePresentation from "@composables/usePresentation";
import useQueue from "@composables/useQueue";

const Present: Component = () => {
  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Extract the composable functions...
  const { toTitleCase } = useFormatting();
  const { initialisePresentationReceiver } = usePresentation();
  const { initialiseProjectionReceiver } = useProjection(channel);

  // To hold the data from the broadcast channel.
  const { peek, currentVerseIndex, setCurrentVerseIndex, enqueue, flush } =
    useQueue();

  const currentVerse = (): string[] | undefined =>
    peek()?.content.at(currentVerseIndex());

  const updatePresentation = (message: MessageEvent) => {
    // When a message is relayed on the connection, extract it.
    const data: IProjectionPayload | null = JSON.parse(message.data);

    // Clear the queue and reset the index.
    flush();
    setCurrentVerseIndex(0);

    // Set the queue and current index.
    if (data !== null) {
      enqueue(...data.queue);
      setCurrentVerseIndex(data.currentVerseIndex);
    }
  };

  onMount(() => {
    initialisePresentationReceiver(updatePresentation);
    initialiseProjectionReceiver(updatePresentation);
  });

  return (
    <div class="flex h-dvh flex-col items-stretch gap-4 bg-gray-100 p-6">
      {/* Title */}
      <Show when={peek() !== undefined && currentVerseIndex() === 0}>
        <h2 class="text-wrap text-center text-2xl font-black uppercase text-[#D15F20] underline md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl">
          {toTitleCase(peek()?.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <div
        style={{ "font-size": "1em" }}
        class="flex flex-auto flex-col items-center justify-center gap-2 rounded-lg bg-[url('/images/tvc-logo.svg')] bg-contain bg-center bg-no-repeat text-center text-[#000435] opacity-100 transition-colors"
        classList={{ "bg-none opacity-full": peek() !== undefined }}
      >
        <Show when={peek() !== undefined}>
          <For each={currentVerse()}>
            {(line) => (
              <div
                class="text-wrap text-2xl font-extrabold uppercase md:text-large lg:text-larger 2xl:text-largest"
                innerHTML={line}
              ></div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default Present;
