import { type Component, createSignal, lazy, Show } from 'solid-js';

// Import the interfaces
import type { IQueueItem } from '@interfaces/track';

// Import the composables.
import useFormatting from '@composables/useFormatting';

// Import components.
const LyricsPreviewCard = lazy(
  () => import('@components/cards/LyricsPreviewCard')
);

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

    setTrack(data['track']);
    setNowPlaying(data['nowPlaying']);
  });

  return (
    <div class="h-screen p-4">
      {/* Title */}
      <Show
        when={track()}
        fallback={<div class="mb-3 h-16 rounded-md bg-gray-200/60"></div>}
      >
        <h2 class="mb-3 text-center text-wrap text-4xl underline font-black text-green-900 lg:mb-4 lg:text-6xl 2xl:text-7xl uppercase">
          {toTitleCase(track()!.title)}
        </h2>
      </Show>

      {/* Lyrics */}
      <LyricsPreviewCard verse={currentVerse()} />
    </div>
  );
};

export default Project;
