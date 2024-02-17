import { Component, For, Show, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

// Import interfaces
import type { ITrack } from './interfaces/track';

// Import components.
import ButtonPlayback from './ui/buttons/ButtonPlayback';
import NowPlayingCard from './ui/cards/NowPlayingCard';
import QueueItem from './ui/queue/QueueListItem';
import SearchForm from './ui/search/SearchForm';
import SearchResults from './ui/search/SearchResults';
import useFormatting from './lib/composables/useFormatting';
import useWindowManagement from './lib/composables/useWindowManagement';

const App: Component = () => {
  // Import the composables.
  const { windowDetails, requestPermissions } = useWindowManagement();
  const { toTitleCase } = useFormatting();

  // Request Window Management Permissions
  onMount(() => {
    requestPermissions();
  });

  const [results, setResults] = createStore<ITrack[]>([]);
  const [queue, setQueue] = createStore<ITrack[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<number>(0);

  // First item in queue (now playing).
  const peek = () => queue.at(0);

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => nowPlaying() === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean => nowPlaying() + 1 === peek()?.lyrics.length;

  // Previous verse
  const goToPreviousVerse = () => {
    if (!isFirstVerse()) {
      setNowPlaying((nowPlaying) => nowPlaying - 1);
    }
  };

  // Next verse
  const goToNextVerse = () => {
    setNowPlaying((nowPlaying) => nowPlaying + 1);
  };

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, { id: Date.now(), ...track }]);
  };

  // Dequeue.
  const dequeue = (id: number | undefined) => {
    setQueue(queue.filter((track) => id !== track.id));

    // Update now playing when a track is dequeued.
    setNowPlaying(0);
  };

  // Clear queue
  const flush = () => {
    setQueue(queue.slice(0, 1));
  };

  // JSX component.
  return (
    // Main container
    <div class="grid gap-4 overflow-hidden p-3 lg:h-screen lg:grid-cols-4">
      <aside class="flex-col justify-between rounded-lg lg:h-[90%]">
        {/* Search Pane */}
        <div class="mb-5 flex-col justify-between rounded-lg bg-gray-300 px-4 pb-4 pt-3">
          {/* Search Form */}
          <SearchForm handler={setResults} />

          {/* Search results */}
          <SearchResults results={results} handler={enqueue} />
        </div>

        {/* Play queue */}
        <div class="rounded-lg bg-gray-200 px-4 pb-4 pt-3">
          {/* Now playing */}
          <div class="mb-1 h-24">
            <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
            <Show when={peek()}>
              <NowPlayingCard track={peek()} />
            </Show>
          </div>

          {/* Up next */}
          <div class="flex justify-between text-gray-500">
            <h3 class="text-sm">Up next</h3>
            <button class="text-sm" onClick={flush}>
              Clear all
            </button>
          </div>
          <div class="h-48 overflow-y-scroll py-0.5 lg:h-56">
            <For each={queue.slice(1)}>
              {(track) => (
                <QueueItem track={track} handler={[dequeue, track.id]} />
              )}
            </For>
          </div>
        </div>
      </aside>

      {/* View Pane */}
      <main class="mb-20 rounded-lg bg-gray-100 px-6 py-4 lg:col-span-3 lg:px-20 lg:py-14">
        {/* Title */}
        <h2 class="mb-3 text-wrap text-4xl font-black text-gray-800 lg:mb-12 lg:text-6xl">
          {toTitleCase(peek()?.title)}
        </h2>

        {/* Lyrics */}
        <div class="text-md text-sm font-medium text-gray-600">
          <ul class="mb-3">
            <For each={peek()?.lyrics[nowPlaying()]}>
              {(line) => (
                <li class="text-wrap text-xl font-semibold lg:text-4xl">
                  {line}
                </li>
              )}
            </For>
          </ul>
        </div>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
            <ButtonPlayback
              isEnabled={peek() !== undefined && !isFirstVerse()}
              text="arrow_back"
              handler={goToPreviousVerse}
            />
            <ButtonPlayback
              isEnabled={peek() !== undefined && !isLastVerse()}
              text="arrow_forward"
              handler={goToNextVerse}
            />
            <ButtonPlayback
              isEnabled={peek() !== undefined}
              text="skip_next"
              handler={() => dequeue(peek()?.id)}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
