import {
  For,
  Show,
  createEffect,
  createSignal,
  lazy,
  onMount,
  type Component,
} from "solid-js";
import { createStore } from "solid-js/store";

// Import the interfaces...
import type { IProjectionPayload } from "@interfaces/projection";
import type { IQueueItem } from "@interfaces/queue";
import type { ISearchItem } from "@interfaces/track";

// Import the composables...
import useFormatting from "@composables/useFormatting";
import useQueue from "@composables/useQueue";

// Import the components...
import OfflineBanner from "@components/banners/OfflineBanner";
import DisplayButton from "@components/buttons/DisplayButton";
import PlaybackButton from "@components/buttons/PlaybackButton";
import ProjectionButton from "@components/buttons/ProjectionButton";
import EditQueueItemForm from "@components/forms/EditQueueItemForm";
import LyricsCardsPreloader from "@components/preloaders/LyricsCardsPreloader";
import usePresentation from "@composables/usePresentation";
import useProjection from "@composables/useProjection";
import LyricsSearchForm from "@components/search/lyrics/LyricsSearchForm";
import LyricsSearchResults from "@components/search/lyrics/LyricsSearchResults";

// Import the lazy-loaded components.
const LyricsCard = lazy(() => import("@components/cards/LyricsCard"));
const NowPlayingCard = lazy(() => import("@components/cards/NowPlayingCard"));
const QueueList = lazy(() => import("@components/queue/QueueList"));

const Controller: Component = () => {
  // Create a BroadcastAPI channel.
  const channel = new BroadcastChannel(import.meta.env.VITE_BROADCAST_NAME);

  // Create the signals.
  const [isOffline, setIsOffline] = createSignal<boolean>(false);
  const [results, setResults] = createStore<ISearchItem[]>([]);

  // Import the composables.
  const { toTitleCase } = useFormatting();
  const { sendPresentationData } = usePresentation();
  const {
    isAvailable,
    isConnected,
    isVisible,
    openProjection,
    showProjection,
    hideProjection,
    closeProjection,
    sendProjectionData,
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

      // Send the data.
      sendPresentationData(data);
      sendProjectionData(data);
    }
  };

  const addToQueue = (item: IQueueItem) => {
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
      dequeue();
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
    // When the network connectivity is lost.
    window.addEventListener("offline", () => {
      setIsOffline(true);
    });

    // When the network connectivity is established.
    window.addEventListener("online", () => {
      setIsOffline(false);
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      // Start/stop projection.
      if (e.shiftKey && e.code === "KeyP")
        isConnected() ? closeProjection() : openProjection();

      // Show/hide content.
      if (e.shiftKey && e.code === "KeyS")
        isVisible()
          ? hideProjection()
          : showProjection({
              nowPlaying: nowPlaying(),
              currentVerseIndex: currentVerseIndex(),
            });

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
    <div class="flex h-dvh flex-col">
      {/* Offline Banner */}
      <OfflineBanner isOffline={isOffline()} />

      <div class="grid grow grid-cols-1 bg-gray-400 lg:grid-cols-4">
        {/* Sidebar */}
        <aside class="col-span-1 flex flex-initial flex-col bg-rose-400">
          {/* Searchbar and search results */}
          <search class="flex h-[40dvh] flex-col bg-yellow-400">
            {/* Searchbar */}
            <LyricsSearchForm searchHandler={setResults} />

            {/* Search results */}
            <LyricsSearchResults
              results={results}
              enqueueHandler={addToQueue}
            />
          </search>

          <section class="flex h-[60dvh] flex-col bg-yellow-400">
            {/* Now playing */}
            <div class="min-h-24">
              <h3 class="mb-1 text-sm text-gray-500">Now Playing</h3>
              <Show
                when={nowPlaying() !== undefined}
                fallback={<div class="h-16 rounded-md bg-gray-600/10"></div>}
              >
                <NowPlayingCard
                  item={nowPlaying()!}
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

            {/* Queue items */}
            <QueueList
              queue={queue}
              playHandler={playNow}
              queueHandler={dequeue}
            />
          </section>
        </aside>

        {/* Live edit */}
        <Show when={isEditing()}>
          <aside class="mb-12 rounded-lg bg-gray-100 p-3 transition lg:mb-20">
            <EditQueueItemForm item={nowPlaying()!} handler={editLyrics} />
          </aside>
        </Show>

        <main class="col-span-1 flex flex-col justify-between bg-gray-400 lg:col-span-3">
          {/* Title */}
          <Show
            when={nowPlaying() !== undefined}
            fallback={<LyricsCardsPreloader canProject={isAvailable()} />}
          >
            <h2 class="mb-3 text-wrap text-4xl font-black uppercase text-tvc-green lg:mb-4 lg:text-6xl">
              {toTitleCase(nowPlaying()!.title)}
            </h2>

            {/* Content */}
            <div class="grid h-[50dvh] grow grid-cols-4 content-start gap-4 overflow-y-scroll">
              <For each={nowPlaying()!.content}>
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
          <footer class="sticky bottom-0 bg-white p-3">
            <div class="flex min-h-16 flex-wrap justify-center gap-4 rounded-lg bg-tvc-green p-4 text-gray-700 md:justify-between md:gap-4 lg:justify-center">
              <ProjectionButton
                title="Shift + P"
                isAvailable={isAvailable()}
                isProjecting={isConnected()}
                startHandler={openProjection}
                stopHandler={closeProjection}
              />
              <DisplayButton
                title="Shift + S"
                isEnabled={isConnected()}
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
    </div>
  );
};

export default Controller;
