import {
  Component,
  For,
  Show,
  createEffect,
  lazy,
  onMount,
} from 'solid-js';
import { createStore } from 'solid-js/store';

// Import interfaces.
import type { ITrack } from '@interfaces/track';

// Import the composables.
import useFormatting from '@composables/useFormatting';
import useProjection from '@/lib/composables/useProjection';
import useQueue from '@/lib/composables/useQueue';
import useWindowManagementAPI from '@composables/useWindowManagementAPI';

// Import components.
import LyricsCardsPreloader from '@components/preloaders/LyricsCardsPreloader';
import PlaybackButton from '@components/buttons/PlaybackButton';
import ProjectionButton from '@components/buttons/ProjectionButton';
import SearchForm from '@components/search/SearchForm';

// Lazy-loaded components.
const LyricsCard = lazy(() => import('@components/cards/LyricsCard'));
const NowPlayingCard = lazy(() => import('@components/cards/NowPlayingCard'));
const QueueList = lazy(() => import('@components/queue/QueueList'));
const SearchResults = lazy(() => import('@components/search/SearchResults'));
const TrackForm = lazy(() => import('@components/forms/TrackForm'));

const App: Component = () => {
  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // Create the signals.
  const [results, setResults] = createStore<ITrack[]>([]);

  // Create the derived signals.
  const hasResults = (): boolean => results.length > 0

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { isProjecting, setProjection, clearProjection, closeProjection } = useProjection(broadcast);
  const {
    queue,
    nowPlaying,
    isEditing,

    peek,
    enqueue,
    dequeue,
    flush,
    playNow,
    editNowPlaying,

    isFirstVerse,
    isLastVerse,
    goToPreviousVerse,
    goToNextVerse,
    goToVerse,

    setIsEditing
  } = useQueue(broadcast);
  const { project } = useWindowManagementAPI();

  onMount(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      // Projection events.
      if (e.shiftKey && e.code === 'KeyC') clearProjection()

      // Playback events.
      if (e.code === 'ArrowLeft') goToPreviousVerse()
      if (e.code === 'ArrowRight') goToNextVerse()
      if (e.shiftKey && e.code === 'ArrowRight') dequeue(peek()!.qid, true)
    })
  })

  createEffect((prev: number | undefined) => {
    // Declare a variable to hold the outgoing data.
    let data: string | null = null

    // If the currently playing verse has changed...
    if (nowPlaying() !== prev) {
      data = peek() !== undefined
        ? JSON.stringify({ track: peek(), nowPlaying: nowPlaying() })
        : null;

      // Send the message.
      broadcast.postMessage(data);
    }

    // Return the now playing to re-use in the next call.
    return nowPlaying()
  });

  return (
    // Main container
    <div class="overflow-hidden grid gap-5 p-6 lg:h-screen md:grid-cols-3 lg:grid-cols-4">
      <aside class="flex flex-col gap-3 rounded-lg lg:mb-20">
        {/* Search Pane */}
        <search class="rounded-lg bg-gray-300 px-4 pb-4 pt-3">
          {/* Search Form */}
          <SearchForm handler={setResults} />

          {/* Search results */}
          <div class="mt-4 overflow-y-scroll transition h-40 rounded-md bg-gray-50/30 md:h-36 xl:h-52 2xl:h-2/6">
            <Show when={hasResults()}>
              <SearchResults results={results} handler={enqueue} />
            </Show>
          </div>
        </search>

        {/* Play queue */}
        <div class="flex-1 flex flex-col rounded-lg bg-gray-200 px-4 pb-4 pt-3 gap-1.5">
          {/* Now playing */}
          <div class="min-h-24">
            <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
            <Show
              when={peek()}
              fallback={<div class="h-16 rounded-md bg-gray-600/10"></div>}
            >
              <NowPlayingCard
                track={peek()}
                handler={() => setIsEditing(!isEditing())}
              />
            </Show>
          </div>

          {/* Up next */}
          <div class="flex justify-between text-gray-500">
            <h3 class="text-sm">Up next</h3>
            <button class="text-sm" onClick={flush}>
              Clear all
            </button>
          </div>

          <div class="overflow-y-scroll md:h-36 lg:h-30 xl:h-48 2xl:h-auto">
            <Show when={queue.length > 1}>
              <QueueList queue={queue} playHandler={playNow} queueHandler={dequeue} />
            </Show>
          </div>
        </div>
      </aside>

      {/* Live edit */}
      <Show when={isEditing()}>
        <aside class="mb-12 rounded-lg bg-gray-100 p-3 transition-transform lg:mb-20">
          <TrackForm track={peek()} handler={editNowPlaying} />
        </aside>
      </Show>

      {/* View Pane */}
      <main
        class="flex flex-col mb-16 rounded-lg transition-transform md:col-start-2 md:col-end-5 lg:col-end-6 lg:mb-20"
        classList={{ 'lg:col-start-3': isEditing() }}
      >
        {/* Title */}
        <Show
          when={peek()}
          fallback={<div class="mb-3 h-16 rounded-md bg-gray-200/60"></div>}
        >
          <h2 class="mb-3 text-wrap text-4xl uppercase font-black text-tvc-green lg:mb-4 lg:text-6xl">
            {toTitleCase(peek()!.title)}
          </h2>
        </Show>

        {/* Lyrics */}
        <Show when={peek()} fallback={<LyricsCardsPreloader />}>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:overflow-y-scroll lg:pb-2">
            <For each={peek()!.lyrics}>
              {(verse, index) => (
                <LyricsCard
                  verse={verse}
                  isActive={nowPlaying() === index()}
                  handler={() => goToVerse(index())}
                />
              )}
            </For>
          </div>
        </Show>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
            <ProjectionButton
              isProjecting={isProjecting()}
              openHandler={async () => setProjection(await project('projectr'))}
              closeHandler={() => closeProjection()}
            />
            <PlaybackButton
              icon="visibility_off"
              text="Clear projection"
              isEnabled={isProjecting()}
              title="Shift + C"
              handler={clearProjection}
            />
            <PlaybackButton
              icon="arrow_back"
              text="Previous verse"
              isEnabled={peek() !== undefined && !isFirstVerse()}
              title="ArrowLeft"
              handler={goToPreviousVerse}
            />
            <PlaybackButton
              icon="arrow_forward"
              text="Next verse"
              isEnabled={peek() !== undefined && !isLastVerse()}
              title="ArrowRight"
              handler={goToNextVerse}
            />
            <PlaybackButton
              icon="skip_next"
              text="Next track"
              isEnabled={peek() !== undefined}
              title="Shift + ArrowRight"
              handler={() => dequeue(peek()!.qid, true)}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
