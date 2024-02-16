import { For, Show, createSignal } from 'solid-js';
import './App.css';

// Import interfaces
import type { ITrack } from './interfaces/track';

// Import components.
import ButtonPlayback from './ui/buttons/ButtonPlayback';

// Sample data.
import data from './data/sample';
import ButtonSection from './ui/buttons/ButtonSection';
import QueueItem from './ui/queue/QueueItem';

function App() {
  const [results] = createSignal<ITrack[]>(data);
  const [queue, setQueue] = createSignal<ITrack[]>([]);

  // Current head of queue.
  const nowPlaying = (): ITrack | undefined => queue().at(0);

  // Enqueue.
  const enqueue = (track: ITrack) => {
    // Create a random ID for the track and add it to the queue.
    setQueue([...queue(), { id: Date.now(), ...track }]);
  };

  // Dequeue.
  const dequeue = (id: number | undefined) => {
    setQueue(queue().filter((track) => id !== track.id));
  };

  // JSX component.
  return (
    // Main container
    <div class="grid gap-4 overflow-hidden p-3 lg:h-screen lg:grid-cols-4">
      <aside class="h-[88%] flex-col justify-between rounded-lg bg-gray-100">
        {/* Search Pane */}
        <form class="mb-4 h-80 rounded-lg bg-gray-300 px-4 pb-4 pt-3">
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

            {/* Search results */}
            <div class="mt-3">
              <For each={results()}>
                {(track) => (
                  <div class="mb-1.5 flex justify-between gap-4 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
                    <span class="material-symbols-outlined cursor-move p-1">
                      drag_pan
                    </span>
                    <h4 class="col-span-2 w-full py-1.5 font-medium italic text-gray-500">
                      {track.title}
                    </h4>
                    <button
                      type="button"
                      class="material-symbols-outlined rounded-full p-1 hover:bg-gray-300"
                      onClick={() => enqueue(track)}
                    >
                      playlist_add
                    </button>
                  </div>
                )}
              </For>
            </div>
          </label>
        </form>

        {/* Play queue */}
        <div class="rounded-lg bg-gray-200 px-4 pb-4 pt-3 lg:h-3/6">
          {/* Now playing */}
          <div class="h-24">
            <h3 class="mb-2 text-sm text-gray-400">Now playing</h3>
            <Show when={nowPlaying()}>
              <div class="grid grid-cols-4 rounded-lg bg-gray-100 px-6 py-3 text-sm">
                <h4 class="col-span-2 font-semibold text-gray-800">
                  {nowPlaying()?.title}
                </h4>
              </div>
            </Show>
          </div>

          {/* Up next */}
          <div class="">
            <h3 class="text-sm text-gray-400">Up next</h3>
            <div class="h-2/5 overflow-scroll">
              <For each={queue().slice(1)}>
                {(track) => (
                  <QueueItem
                    isMovable={true}
                    track={track}
                    handler={[dequeue, track.id ? [track.id] : []]}
                    icon="playlist_remove"
                  />
                )}
              </For>
            </div>
          </div>
        </div>
      </aside>

      {/* View Pane */}
      <main class="mb-32 rounded-lg bg-gray-100 px-6 py-4 lg:col-span-3 lg:mb-20 lg:px-12 lg:py-10">
        {/* Title */}
        <h2 class="mb-3 text-wrap text-4xl font-black text-gray-800 lg:text-5xl">
          {nowPlaying()?.title}
        </h2>

        {/* Lyrics */}
        <div class="text-md font-medium text-gray-600">
          <For
            each={[
              nowPlaying()?.lyrics.intro,
              ...(nowPlaying()?.lyrics.verses || []),
            ]}
          >
            {(verse) => (
              <ul class="mb-3">
                <For each={verse}>
                  {(line) => (
                    <li>
                      <span class="italic">{line}</span>
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
              isEnabled={nowPlaying() !== undefined}
              text="arrow_back"
            />
            <ButtonPlayback
              isEnabled={nowPlaying() !== undefined}
              text="arrow_forward"
            />
            <ButtonPlayback
              isEnabled={nowPlaying() !== undefined}
              text="skip_next"
              handler={() => dequeue(nowPlaying()?.id)}
            />
            <ButtonSection
              isEnabled={nowPlaying()?.lyrics.preChorus !== undefined}
              text="Pre-Chorus"
            />
            <ButtonSection
              isEnabled={nowPlaying()?.lyrics.chorus !== undefined}
              text="Chorus"
            />
            <ButtonSection
              isEnabled={nowPlaying()?.lyrics.bridge !== undefined}
              text="Bridge"
            />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
