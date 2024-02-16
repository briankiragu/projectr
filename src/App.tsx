import { For, createSignal } from "solid-js";
import "./App.css";
import type { ITrack } from "./interfaces/track";

// Sample data.
import data from "./data/sample";

function App() {
  const [results] = createSignal<ITrack[]>(data);
  const [queue, setQueue] = createSignal<ITrack[]>([]);

  // Current head of queue.
  const nowPlaying = (): ITrack | undefined => queue().at(0);

  // Enqueue.
  const enqueue = (track: ITrack, event: Event) => {
    event.preventDefault();
    setQueue([...queue(), track]);
  };

  // Dequeue.
  const dequeue = (track: ITrack, event: Event) => {
    event.preventDefault();
    setQueue(queue().filter((item) => item.title !== track.title));
  };

  // JSX component.
  return (
    <>
      <div class="grid gap-4 p-3 lg:grid-cols-4">
        <div class="grid gap-4">
          {/* Search Pane */}
          <form class="grid h-72 grid-cols-1 rounded-lg bg-gray-300 px-4 pb-4 pt-3">
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
              />

              {/* Search results */}
              <div class="mt-5">
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
                        onClick={[enqueue, track]}
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
          <div class="rounded-lg bg-gray-200 px-4 pb-4 pt-3">
            {/* Now playing */}
            <div class="h-24">
              <h3 class="mb-2 text-sm text-gray-400">Now playing</h3>
              <div class="grid grid-cols-4 rounded-lg bg-gray-100 px-6 py-3 text-sm">
                <h4 class="col-span-2 font-semibold text-gray-800">
                  {nowPlaying()?.title}
                </h4>
              </div>
            </div>

            {/* Up next */}
            <div>
              <h3 class="mb-2 text-sm text-gray-400">Up next</h3>
              <div>
                <For each={queue().slice(1)}>
                  {(track) => (
                    <div class="mb-2 flex justify-between gap-4 rounded-lg bg-gray-100 px-4 py-2 align-middle text-sm text-gray-600">
                      <span class="material-symbols-outlined cursor-move p-1">
                        drag_pan
                      </span>
                      <h4 class="col-span-2 w-full py-1 font-semibold">
                        {track.title}
                      </h4>
                      <button
                        class="material-symbols-outlined rounded-full p-1 hover:bg-gray-300"
                        onClick={[dequeue, track]}
                      >
                        playlist_remove
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>

        {/* View Pane */}
        <div class="mb-20 rounded-lg bg-gray-100 px-6 py-4 md:col-span-3">
          {/* Title */}
          <h2 class="mb-3 text-5xl font-extrabold">{nowPlaying()?.title}</h2>

          {/* Lyrics */}
          {/* <div class="text-md font-medium text-gray-500">
          {queue.value.at(0)?.lyrics.map((stanza, stanzaIndex) => (
            <div key={stanzaIndex} class="mb-3">
              {stanza.map((lyric: string, lyricIndex: number) => (
                <p key={lyricIndex}>{lyric}</p>
              ))}
            </div>
          ))}
        </div> */}

          {/* Controls */}
          <section class="fixed bottom-0 left-0 w-full bg-white p-3">
            <div class="flex h-16 justify-between gap-4 rounded-lg bg-gray-200 p-4 text-gray-700 lg:justify-center">
              {/* <button class="h-8 w-8 rounded-full transition-all hover:bg-gray-400">
              <span class="material-symbols-outlined">skip_previous</span>
            </button> */}
              <button
                class="h-8 w-8 rounded-full transition-colors hover:bg-gray-400"
                classList={{
                  "hover:bg-gray-200 disabled:text-gray-300": !nowPlaying(),
                }}
                disabled={!nowPlaying()}
              >
                <span class="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                class="h-8 w-8 rounded-full transition-colors hover:bg-gray-400"
                classList={{
                  "hover:bg-gray-200 disabled:text-gray-300": !nowPlaying(),
                }}
                disabled={!nowPlaying()}
              >
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                class="h-8 w-8 rounded-full transition-colors hover:bg-gray-400"
                classList={{
                  "hover:bg-gray-200 disabled:text-gray-300": !nowPlaying(),
                }}
                disabled={!nowPlaying()}
                onClick={[dequeue, nowPlaying()]}
              >
                <span class="material-symbols-outlined ">skip_next</span>
              </button>
              <button
                class="flex justify-center rounded-md px-2 py-2 align-middle transition-colors hover:bg-gray-400"
                classList={{
                  "hover:bg-gray-200 disabled:text-gray-300": !nowPlaying(),
                }}
                disabled={!nowPlaying()?.lyrics.bridge}
              >
                Bridge
              </button>
              <button
                class="flex justify-center rounded-md px-2 py-2 align-middle transition-colors hover:bg-gray-400"
                classList={{
                  "hover:bg-gray-200 disabled:text-gray-300": !nowPlaying(),
                }}
                disabled={!nowPlaying()?.lyrics.chorus}
              >
                Chorus
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
