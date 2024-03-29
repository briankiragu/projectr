import { Component, For, Show, createEffect, lazy, onMount } from "solid-js";
import { createStore } from "solid-js/store";

// Import the interfaces.
import type { IQueueItem, ISearchItem } from "@interfaces/track";
import type { IProjectionPayload } from "@interfaces/projection";

// Import the composables.
import useFormatting from "@composables/useFormatting";
import useProjection from "@composables/useProjection";
import useQueue from "@composables/useQueue";

// Import the components.
import DisplayButton from "@components/buttons/DisplayButton";
import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import PlaybackButton from "@components/buttons/PlaybackButton";
import ProjectionButton from "@components/buttons/ProjectionButton";
import SearchForm from "@components/search/SearchForm";
import EditTrackForm from "@components/forms/EditTrackForm";

// Import the lazy-loaded components.
const LyricsCard = lazy(() => import("@components/cards/LyricsCard"));
const NowPlayingCard = lazy(() => import("@components/cards/NowPlayingCard"));
const QueueList = lazy(() => import("@components/queue/QueueList"));
const SearchResults = lazy(() => import("@components/search/SearchResults"));

const App: Component = () => {
  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Create the signals.
  const [results, setResults] = createStore<ISearchItem[]>([]);

  // Create the derived signals.
  const hasResults = (): boolean => results.length > 0;

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const {
    isSupported,
    isProjecting,
    isVisible,
    openProjection,
    showProjection,
    hideProjection,
    closeProjection,
  } = useProjection(channel);
  const {
    queue,
    nowPlaying,
    currentVerseIndex,
    isEditing,

    setNowPlaying,
    setCurrentVerseIndex,

    peek,
    enqueue,
    dequeue,
    flush,

    setIsEditing,

    isFirstVerse,
    isLastVerse,
    goToPreviousVerse,
    goToNextVerse,
    goToVerse,
  } = useQueue();

  // Send the data over the channel.
  const broadcast = () => {
    if (isVisible()) {
      // Declare a variable to hold the outgoing data.
      const data: IProjectionPayload | null =
        nowPlaying() !== undefined
          ? {
              nowPlaying: nowPlaying(),
              currentVerseIndex: currentVerseIndex(),
            }
          : null;

      // Send the message.
      channel.postMessage(JSON.stringify(data));
    }
  };

  const addToQueue = (track: ISearchItem) => {
    const item: IQueueItem = {
      ...track,
      qid: Date.now(),
    };

    if (nowPlaying() === undefined) {
      setNowPlaying(item);
      broadcast();
    } else {
      enqueue(item);
    }
  };

  /**
   * Set a queued playing track as now playing.
   */
  const playNow = (qid: number) => {
    // Find the item in the queue.
    const track = queue.find((track) => track.qid === qid);

    // Set the current now playing.
    setNowPlaying(track);

    // Update the queue.
    dequeue(qid);

    // Reset the verse and editing.
    setCurrentVerseIndex(0);
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  const playNext = () => {
    // Find the item in the queue.
    const track = peek();

    // Set the current now playing.
    setNowPlaying(track);

    if (track !== undefined) {
      // Update the queue.
      dequeue(track.qid);
    }

    // Reset the verse and editing.
    setCurrentVerseIndex(0);
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  /**
   * Edit the currently playing track lyrics.
   */
  const editLyrics = (track: IQueueItem) => {
    // Edit the now playing track.
    setNowPlaying(track);

    // Toggle live edit
    setIsEditing(false);

    // Broadcast the data.
    broadcast();
  };

  onMount(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      // Projection events.
      if (e.shiftKey && e.code === "KeyP")
        isProjecting() ? closeProjection() : openProjection();

      // Playback events.
      if (e.code === "ArrowLeft") goToPreviousVerse();
      if (e.code === "ArrowRight") goToNextVerse();
      if (e.shiftKey && e.code === "ArrowRight") playNext();
    });
  });

  createEffect((prev: number | undefined) => {
    // If the currently playing verse has changed...
    if (currentVerseIndex() !== prev) broadcast();

    // Return the now playing to re-use in the next call.
    return currentVerseIndex();
  });

  return (
    // Main container
    <div class="grid gap-5 p-6 md:grid-cols-3 lg:grid-cols-4">
      <aside class="flex flex-col gap-3 rounded-lg lg:mb-20">
        {/* Search Pane */}
        <search class="rounded-lg bg-gray-300 px-4 pb-4 pt-3">
          {/* Search Form */}
          <SearchForm handler={setResults} />

          {/* Search results */}
          <div class="mt-4 h-40 overflow-y-scroll rounded-md bg-gray-50/10 transition md:h-36 xl:h-52 2xl:h-2/6">
            <Show when={hasResults()}>
              <SearchResults results={results} handler={addToQueue} />
            </Show>
          </div>
        </search>

        {/* Play queue */}
        <div class="flex flex-1 flex-col gap-1.5 rounded-lg bg-gray-200 px-4 pb-4 pt-3">
          {/* Now playing */}
          <div class="min-h-24">
            <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
            <Show
              when={nowPlaying() !== undefined}
              fallback={<div class="h-16 rounded-md bg-gray-600/10"></div>}
            >
              <NowPlayingCard
                track={nowPlaying()!}
                handler={() => setIsEditing(!isEditing())}
              />
            </Show>
          </div>

          {/* Up next */}
          <div class="flex justify-between text-gray-500">
            <h3 class="text-sm">Up next</h3>
            <button class="text-sm" onClick={() => flush()}>
              Clear all
            </button>
          </div>

          <div class="lg:h-30 overflow-y-scroll rounded-lg bg-gray-300/40 md:h-36 xl:h-44 2xl:h-auto">
            <Show when={queue.length > 0}>
              <QueueList
                queue={queue}
                playHandler={playNow}
                queueHandler={dequeue}
              />
            </Show>
          </div>
        </div>
      </aside>

      {/* Live edit */}
      <Show when={isEditing()}>
        <aside class="mb-12 rounded-lg bg-gray-100 p-3 transition-transform lg:mb-20">
          <EditTrackForm track={nowPlaying()!} handler={editLyrics} />
        </aside>
      </Show>

      {/* View Pane */}
      <main
        class="mb-16 flex flex-col rounded-lg transition-transform md:col-start-2 md:col-end-5 lg:col-end-6 lg:mb-20"
        classList={{ "lg:col-start-3": isEditing() }}
      >
        {/* Title */}
        <Show
          when={nowPlaying() !== undefined}
          fallback={<LyricsCardsPreloader />}
        >
          <h2 class="mb-3 text-wrap text-4xl font-black uppercase text-tvc-green lg:mb-4 lg:text-6xl">
            {toTitleCase(nowPlaying()!.title)}
          </h2>

          {/* Lyrics */}
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:overflow-y-scroll lg:grid-cols-3 lg:pb-2">
            <For each={nowPlaying()!.lyrics}>
              {(verse, index) => (
                <LyricsCard
                  verse={verse}
                  isActive={currentVerseIndex() === index()}
                  handler={() => goToVerse(index())}
                />
              )}
            </For>
          </div>
        </Show>

        {/* Controls */}
        <footer class="fixed bottom-0 left-0 w-full bg-white p-3">
          <div class="flex min-h-16 flex-wrap justify-center gap-4 rounded-lg bg-tvc-green p-4 text-gray-700 md:justify-between md:gap-4 lg:justify-center">
            <ProjectionButton
              title="Shift + P"
              isEnabled={isSupported()}
              isProjecting={isProjecting()}
              startHandler={openProjection}
              stopHandler={closeProjection}
            />
            <DisplayButton
              isEnabled={isProjecting()}
              isDisplaying={isVisible()}
              showHandler={() =>
                showProjection({
                  nowPlaying: nowPlaying(),
                  currentVerseIndex: currentVerseIndex(),
                })
              }
              hideHandler={hideProjection}
            />
            <PlaybackButton
              icon="arrow_back"
              text="Previous verse"
              title="ArrowLeft"
              isEnabled={nowPlaying() !== undefined && !isFirstVerse()}
              handler={goToPreviousVerse}
            />
            <PlaybackButton
              icon="arrow_forward"
              text="Next verse"
              title="ArrowRight"
              isEnabled={nowPlaying() !== undefined && !isLastVerse()}
              handler={goToNextVerse}
            />
            <PlaybackButton
              icon="skip_next"
              text="Next track"
              title="Shift + ArrowRight"
              isEnabled={peek() !== undefined || nowPlaying() !== undefined}
              handler={playNext}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
