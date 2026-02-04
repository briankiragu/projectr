import {
  type Component,
  createSignal,
  createEffect,
  Show,
  For,
  onMount,
} from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useProjection from "@composables/useProjection";
import usePresentation from "@composables/usePresentation";

const Prompter: Component = () => {
  // Refs for verse elements to enable scrolling.
  let verseRefs: HTMLDivElement[] = [];

  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { initialisePresentationReceiver } = usePresentation();
  const { initialiseProjectionReceiver } = useProjection(channel);

  // To hold the data from the broadcast channel.
  const [nowPlaying, setNowPlaying] = createSignal<IQueueItem | undefined>();
  const [currentVerseIndex, setCurrentVerseIndex] = createSignal(0);

  const updatePresentation = (message: MessageEvent) => {
    // When a message is relayed on the connection, extract it.
    const data = JSON.parse(message.data);

    setNowPlaying(data !== null ? data["nowPlaying"] : undefined);
    setCurrentVerseIndex(data !== null ? data["currentVerseIndex"] : undefined);
  };

  // Auto-scroll to center the current verse when it changes.
  createEffect(() => {
    const index = currentVerseIndex();
    const verseElement = verseRefs[index];

    if (verseElement) {
      verseElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  onMount(() => {
    document.title = "Projectr | Prompter";

    initialisePresentationReceiver(updatePresentation);
    initialiseProjectionReceiver(updatePresentation);
  });

  return (
    <div class="flex min-h-dvh flex-col items-stretch gap-4 bg-gray-100 p-6">
      {/* Title */}
      <h2 class="text-wrap text-center font-serif text-2xl font-black uppercase text-[#D15F20] underline md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl">
        {toTitleCase(nowPlaying()?.title)}
      </h2>

      {/* Lyrics - Scrollable list */}
      <div
        style={{ "font-size": "1em" }}
        class="flex flex-auto flex-col items-center justify-center gap-2 rounded-lg bg-[url('/images/tvc-logo.svg')] bg-contain bg-center bg-no-repeat text-center text-[#000435] opacity-100 transition-colors 2xl:px-6"
        classList={{ "bg-none opacity-full": nowPlaying() !== undefined }}
      >
        <Show when={nowPlaying() !== undefined}>
          <For each={nowPlaying()?.content}>
            {(verse, index) => (
              <div
                ref={(el) => (verseRefs[index()] = el)}
                class="text-wrap mb-20 font-serif text-2xl font-black uppercase italic"
                classList={{
                  "md:text-4xl lg:text-7xl 2xl:text-8xl":
                    currentVerseIndex() === index(),
                  "text-gray-600 md:text-3xl lg:text-6xl 2xl:text-7xl":
                    currentVerseIndex() !== index(),
                }}
              >
                <For each={verse}>{(line) => <div innerHTML={line}></div>}</For>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default Prompter;
