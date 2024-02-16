import { For, Show, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

// Import interfaces
import type { INowPlaying, ITrack } from './interfaces/track';

// Import components.
import ButtonPlayback from './ui/buttons/ButtonPlayback';

// Sample data.
import data from './data/sample';
import ButtonSection from './ui/buttons/ButtonSection';
import QueueItem from './ui/queue/QueueListItem';
import SearchResultsItem from './ui/search/SearchResultsItem';
import NowPlayingCard from './ui/cards/NowPlayingCard';

function App() {
  const [results] = createStore<ITrack[]>(data);
  const [queue, setQueue] = createStore<ITrack[]>([]);
  const [nowPlaying, setNowPlaying] = createSignal<INowPlaying>({
    track: undefined,
    activeVerseIndex: 0,
  });

  // Check if the current verse is not the first.
  const isFirstVerse = (): boolean => nowPlaying().activeVerseIndex === 0;

  // Check if the current verse is not the last.
  const isLastVerse = (): boolean =>
    nowPlaying().activeVerseIndex + 1 ===
    [
      nowPlaying().track?.lyrics.intro,
      ...(nowPlaying().track?.lyrics.verses || []),
    ].length;

  // Previous verse
  const goToPreviousVerse = () => {
    setNowPlaying({
      ...nowPlaying(),
      activeVerseIndex: !isFirstVerse() ? nowPlaying().activeVerseIndex - 1 : 0,
    });
    console.dir(nowPlaying());
  };

  // Next verse
  const goToNextVerse = () => {
    setNowPlaying({
      ...nowPlaying(),
      activeVerseIndex: nowPlaying().activeVerseIndex++,
    });
    console.dir(nowPlaying());
  };

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue, { id: Date.now(), ...track }]);

    // If the queue was empty, set the new now playing
    if (queue.length === 1) {
      setNowPlaying({ ...nowPlaying(), track: queue.at(0) });
    }
  };

  // Dequeue.
  const dequeue = (id: number | undefined) => {
    setQueue(queue.filter((track) => id !== track.id));

    // Update now playing when a track is queued or dequeued.
    setNowPlaying({ ...nowPlaying(), track: queue.at(0) });
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
          <form>
            <label for="search">
              <span class="text-sm italic text-gray-800">
                Search for a song by title or lyrics...
              </span>
              <input
                id="search"
                type="search"
                name="search"
                class="mt-1 w-full rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none"
                placeholder="Search for a song by title or lyrics..."
                autofocus
              />
            </label>
          </form>

          {/* Search results */}
          <div class="mt-3 h-40 overflow-y-scroll lg:h-52">
            <For each={results}>
              {(track) => (
                <SearchResultsItem track={track} handler={[enqueue, track]} />
              )}
            </For>
          </div>
        </div>

        {/* Play queue */}
        <div class="rounded-lg bg-gray-200 px-4 pb-4 pt-3">
          {/* Now playing */}
          <div class="mb-1 h-24">
            <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
            <Show when={nowPlaying().track}>
              <NowPlayingCard track={nowPlaying().track} />
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
      <main class="mb-32 rounded-lg bg-gray-100 px-6 py-4 lg:col-span-3 lg:mb-20 lg:px-12 lg:py-10">
        {/* Title */}
        <h2 class="mb-3 text-wrap text-4xl font-black text-gray-800 lg:text-5xl">
          {nowPlaying().track?.title}
        </h2>

        {/* Lyrics */}
        <div class="text-md text-sm font-medium text-gray-600">
          <For
            each={[
              nowPlaying().track?.lyrics.intro,
              ...(nowPlaying().track?.lyrics.verses || []),
            ]}
          >
            {(verse) => (
              <ul class="mb-3">
                <For each={verse}>
                  {(line) => (
                    <li>
                      <span class="text-wrap italic">{line}</span>
                    </li>
                  )}
                </For>
              </ul>
            )}
          </For>
        </div>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
            <ButtonPlayback
              isEnabled={!isFirstVerse}
              text="arrow_back"
              handler={() => goToPreviousVerse}
            />
            <ButtonPlayback
              isEnabled={!isLastVerse}
              text="arrow_forward"
              handler={() => goToNextVerse}
            />
            <ButtonPlayback
              isEnabled={nowPlaying().track !== undefined}
              text="skip_next"
              handler={() => dequeue(nowPlaying().track?.id)}
            />
            <ButtonSection
              isEnabled={nowPlaying().track?.lyrics.preChorus !== undefined}
              text="Pre-Chorus"
            />
            <ButtonSection
              isEnabled={nowPlaying().track?.lyrics.chorus !== undefined}
              text="Chorus"
            />
            <ButtonSection
              isEnabled={nowPlaying().track?.lyrics.bridge !== undefined}
              text="Bridge"
            />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
