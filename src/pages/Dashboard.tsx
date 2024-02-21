import {
  Component,
  For,
  Show,
  createEffect,
  createSignal,
  lazy,
} from 'solid-js';
import { createStore } from 'solid-js/store';

// Import interfaces.
import type { ITrack } from '../interfaces/track';

// Import the composables.
import useFormatting from '../lib/composables/useFormatting';
import useWindowManagement from '../lib/composables/useWindowManagement';

// Import components.
const LyricsCard = lazy(() => import('../ui/cards/LyricsCard'));
const LyricsPreviewCard = lazy(() => import('../ui/cards/LyricsPreviewCard'));
const NowPlayingCard = lazy(() => import('../ui/cards/NowPlayingCard'));
const PlaybackButton = lazy(() => import('../ui/buttons/PlaybackButton'));
const QueueItem = lazy(() => import('../ui/queue/QueueListItem'));
const SearchForm = lazy(() => import('../ui/search/SearchForm'));
const SearchResults = lazy(() => import('../ui/search/SearchResults'));
const TrackForm = lazy(() => import('../ui/forms/TrackForm'));
const ProjectionButton = lazy(() => import('../ui/buttons/ProjectionButton'));

const App: Component = () => {
  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { project } = useWindowManagement();

  const [results, setResults] = createStore<ITrack[]>([]);
  const [queue, setQueue] = createStore<ITrack[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<number>(0);
  const [enableEditing, setEnableEditing] = createSignal<boolean>(false);

  // First item in queue (now playing).
  const peek = () => queue.at(0);

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => nowPlaying() === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean => nowPlaying() + 1 === peek()?.lyrics.length;

  // Previous verse.
  const goToPreviousVerse = () => {
    if (!isFirstVerse()) {
      setNowPlaying((nowPlaying) => nowPlaying - 1);
    }
  };

  // Next verse.
  const goToNextVerse = () => {
    setNowPlaying((nowPlaying) => nowPlaying + 1);
  };

  // Go to a specific verse.
  const goToVerse = (index: number) => {
    setNowPlaying(index);
  };

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, track]);
  };

  // Dequeue.
  const dequeue = (id: number, reset?: boolean) => {
    setQueue(queue.filter((track) => id !== track.id));

    // Update now playing when a track is dequeued.
    if (reset) {
      setNowPlaying(0);
      setEnableEditing(false);
    }

    // If the queue is finished, clear the projection.
    if (peek() === undefined) {
      broadcast.postMessage(null);
    }
  };

  // Clear queue
  const flush = () => setQueue(queue.slice(0, 1));

  const alterNowPlaying = (lyrics: string[][], id: number) => {
    // Update an item in the queue.
    setQueue(
      (track) => track.id === id,
      'lyrics',
      () => lyrics
    );

    // Toggle live edit
    setEnableEditing(false);
  };

  createEffect(() => {
    const data = JSON.stringify(peek()?.lyrics[nowPlaying()]);
    broadcast.postMessage(data);
  });

  // JSX component.
  return (
    // Main container
    <div class="grid gap-4 p-4 lg:h-screen lg:grid-cols-4">
      <aside class="flex flex-col gap-3 rounded-lg lg:mb-20">
        {/* Search Pane */}
        <search class="flex flex-col gap-2 rounded-lg bg-gray-300 px-4 pb-4 pt-3">
          {/* Search Form */}
          <SearchForm handler={setResults} />

          {/* Search results */}
          <SearchResults results={results} handler={enqueue} />
        </search>

        {/* Play queue */}
        <div class="rounded-lg bg-gray-200 px-4 pb-4 pt-3">
          {/* Now playing */}
          <div class="mb-1 h-24">
            <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
            <Show
              when={peek()}
              fallback={<div class="h-16 rounded-md bg-gray-600/10"></div>}
            >
              <NowPlayingCard
                track={peek()}
                handler={() => setEnableEditing(!enableEditing())}
              />
            </Show>
          </div>

          {/* Up next */}
          <div class="text-gray-500">
            <div class="mb-1.5 flex justify-between">
              <h3 class="text-sm">Up next</h3>
              <button class="text-sm" onClick={flush}>
                Clear all
              </button>
            </div>

            <div class="flex h-48 flex-col gap-2 overflow-y-scroll rounded-md bg-gray-50/50 lg:h-56">
              <For each={queue.slice(1)}>
                {(track) => (
                  <QueueItem track={track} handler={() => dequeue(track.id)} />
                )}
              </For>
            </div>
          </div>
        </div>
      </aside>

      {/* Live edit */}
      <Show when={enableEditing()}>
        <aside class="mb-12 rounded-lg bg-gray-100 p-3 transition-transform lg:mb-20">
          <TrackForm track={peek()} handler={alterNowPlaying} />
        </aside>
      </Show>

      {/* View Pane */}
      <main
        class="mb-20 rounded-lg px-6 py-4 transition-transform lg:col-start-2 lg:col-end-6 lg:px-4 lg:py-2"
        classList={{ 'lg:col-start-3': enableEditing() }}
      >
        {/* Title */}
        <Show when={peek()}>
          <h2 class="mb-3 text-wrap text-4xl font-black text-gray-800 lg:mb-4 lg:text-6xl">
            {toTitleCase(peek()!.title)}
          </h2>
        </Show>

        {/* Preview */}
        <div class="mb-5">
          <Show when={peek()}>
            <LyricsPreviewCard verse={peek()!.lyrics[nowPlaying()]} />
          </Show>
        </div>

        {/* Lyrics */}
        <div class="grid grid-cols-1 gap-4 lg:h-80 lg:grid-cols-3 lg:overflow-y-scroll lg:pb-2">
          <For each={peek()?.lyrics}>
            {(verse, index) => (
              <LyricsCard
                verse={verse}
                isActive={nowPlaying() === index()}
                handler={() => goToVerse(index())}
              />
            )}
          </For>
        </div>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
            <ProjectionButton handler={() => project('projectr')} />
            <PlaybackButton
              isEnabled={peek() !== undefined && !isFirstVerse()}
              icon="arrow_back"
              text="Previous verse"
              handler={goToPreviousVerse}
            />
            <PlaybackButton
              isEnabled={peek() !== undefined && !isLastVerse()}
              icon="arrow_forward"
              text="Next verse"
              handler={goToNextVerse}
            />
            <PlaybackButton
              isEnabled={peek() !== undefined}
              icon="skip_next"
              text="Next track"
              handler={() => dequeue(peek()!.id, true)}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
