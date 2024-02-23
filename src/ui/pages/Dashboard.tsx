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
import type { ITrack } from '@interfaces/track';

// Import the composables.
import useFormatting from '@composables/useFormatting';
import useWindowManagementAPI from '@composables/useWindowManagementAPI';

// Import components.
const LyricsCard = lazy(() => import('@components/cards/LyricsCard'));
const LyricsPreviewCard = lazy(
  () => import('@components/cards/LyricsPreviewCard')
);
const NowPlayingCard = lazy(() => import('@components/cards/NowPlayingCard'));
const PlaybackButton = lazy(() => import('@components/buttons/PlaybackButton'));
const ProjectionButton = lazy(
  () => import('@components/buttons/ProjectionButton')
);
const QueueList = lazy(() => import('@components/queue/QueueList'));
const SearchForm = lazy(() => import('@components/search/SearchForm'));
const SearchResults = lazy(() => import('@components/search/SearchResults'));
const TrackForm = lazy(() => import('@components/forms/TrackForm'));

const App: Component = () => {
  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { project } = useWindowManagementAPI();

  const [results, setResults] = createStore<ITrack[]>([]);
  const [queue, setQueue] = createStore<ITrack[]>([]);
  const [isProjecting, setIsProjecting] = createSignal(false);
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
    setQueue([...queue, { qid: Date.now(), ...track }]);
  };

  // Dequeue.
  const dequeue = (qid: number | undefined, reset?: boolean) => {
    setQueue(queue.filter((track) => qid !== track.qid));

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

  const alterNowPlaying = (lyrics: string[][], qid: number | undefined) => {
    // Update an item in the queue.
    setQueue(
      (track) => track.qid === qid,
      'lyrics',
      () => lyrics
    );

    // Toggle live edit
    setEnableEditing(false);
  };

  const onProject = async () => {
    const proxy = await project('projectr');

    if (proxy) {
      setIsProjecting(true);
    }
  };

  createEffect(() => {
    const data = JSON.stringify({
      track: peek(),
      nowPlaying: nowPlaying()
    });

    broadcast.postMessage(data);
  });

  // JSX component.
  return (
    // Main container
    <div class="grid gap-5 p-6 lg:h-screen lg:grid-cols-4">
      <aside class="flex flex-col gap-5 rounded-lg lg:mb-20">
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

            <QueueList queue={queue} handler={dequeue} />
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
        class="mb-16 rounded-lg transition-transform lg:col-start-2 lg:col-end-6 lg:mb-20"
        classList={{ 'lg:col-start-3': enableEditing() }}
      >
        {/* Title */}
        <Show
          when={peek()}
          fallback={<div class="mb-3 h-16 rounded-md bg-gray-200/60"></div>}
        >
          <h2 class="mb-3 text-wrap text-4xl uppercase font-black text-center text-yellow-600 lg:mb-4 lg:text-6xl">
            {toTitleCase(peek()!.title)}
          </h2>
        </Show>

        {/* Preview */}
        <div class="mb-5">
          <Show
            when={peek()}
            fallback={<div class="h-72 rounded-md bg-gray-300/50"></div>}
          >
            <LyricsPreviewCard verse={peek()!.lyrics[nowPlaying()]} />
          </Show>
        </div>

        {/* Lyrics Preloader */}
        <Show when={!peek()}>
          <div class="h-42 hidden grid-cols-1 gap-4 lg:grid lg:h-80 lg:grid-cols-3 lg:overflow-y-scroll lg:pb-2">
            <div class="rounded-md bg-gray-200/40"></div>
            <div class="rounded-md bg-gray-200/40"></div>
            <div class="rounded-md bg-gray-200/40"></div>
          </div>
        </Show>

        {/* Lyrics */}
        <div class="grid grid-cols-1 gap-4 lg:h-80 lg:grid-cols-3 lg:overflow-y-scroll lg:pb-2">
          <Show when={peek()}>
            <For each={peek()?.lyrics}>
              {(verse, index) => (
                <LyricsCard
                  verse={verse}
                  isActive={nowPlaying() === index()}
                  handler={() => goToVerse(index())}
                />
              )}
            </For>
          </Show>
        </div>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
            <ProjectionButton
              isProjecting={isProjecting()}
              handler={onProject}
            />
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
              handler={() => dequeue(peek()!.qid, true)}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
