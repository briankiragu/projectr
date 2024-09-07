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
import type { ISearchItem } from "@interfaces/lyric";

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
  // eslint-disable-next-line no-empty-pattern
  const {
    // isAvailable: receiverIsAvailable,
    // isConnected: receiverIsConnected,
    // isVisible: receiverIsVisible,
    // openPresentation: openReceiver,
    // showPresentation: showOnReceiver,
    // hidePresentation: hideOnReceiver,
    // closePresentation: closeReceiver,
    // sendPresentationData: sendToReceiver,
  } = usePresentation();
  // eslint-disable-next-line no-empty-pattern
  const {
    isAvailable: receiverIsAvailable,
    isConnected: receiverIsConnected,
    isVisible: receiverIsVisible,
    openProjection: openReceiver,
    showProjection: showOnReceiver,
    hideProjection: hideOnReceiver,
    closeProjection: closeReceiver,
    sendProjectionData: sendToReceiver,
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
    if (receiverIsVisible()) {
      // Declare a variable to hold the outgoing data.
      const data: IProjectionPayload | null =
        nowPlaying() !== undefined
          ? {
              nowPlaying: nowPlaying(),
              currentVerseIndex: currentVerseIndex(),
            }
          : null;

      // Send the data.
      sendToReceiver(data);
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
   * Edit the currently playing track content.
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
        receiverIsConnected() ? closeReceiver() : openReceiver();

      // Show/hide content.
      if (e.shiftKey && e.code === "KeyS")
        receiverIsVisible()
          ? hideOnReceiver()
          : showOnReceiver({
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
      <Show when={isOffline()}>
        <OfflineBanner />
      </Show>

      <div
        class="grid grow grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        classList={{ "md:grid-cols-3": isEditing() }}
      >
        {/* Sidebar */}
        <aside class="col-span-1 flex flex-initial flex-col gap-4">
          {/* Searchbar and search results */}
          <search class="flex h-[45dvh] flex-col gap-4 rounded-lg bg-tvc-orange px-4 pb-4 pt-2 dark:bg-orange-600">
            {/* Searchbar */}
            <div class="flex flex-col gap-2">
              <h2 class="text-4xl font-black tracking-tight text-gray-900">
                Search
              </h2>
              <LyricsSearchForm searchHandler={setResults} />
            </div>

            {/* Search results */}
            <LyricsSearchResults
              results={results}
              enqueueHandler={addToQueue}
            />
          </search>

          <section class="flex h-[45dvh] flex-col rounded-lg bg-tvc-orange p-4 md:h-[48dvh] xl:h-[48.9dvh] 2xl:h-[49.9dvh] dark:bg-orange-600">
            {/* Now playing */}
            <div class="mb-2 min-h-24">
              <h3 class="mb-1 text-sm font-semibold text-gray-900">
                Now Playing
              </h3>
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
            <div class="mb-2 flex justify-between font-semibold text-gray-800">
              <h3 class="text-sm">Up next</h3>
              <button
                class="flex items-center gap-1.5 rounded-md px-2 text-sm transition hover:text-white dark:hover:text-gray-100"
                classList={{ hidden: peek() === undefined }}
                onClick={() => flush()}
              >
                <span class="material-symbols-outlined transition-colors">
                  clear_all
                </span>
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
          <section class="grow rounded-lg bg-gray-100 p-3 transition">
            <EditQueueItemForm item={nowPlaying()!} handler={editLyrics} />
          </section>
        </Show>

        <main
          class="col-span-1 flex flex-col justify-between rounded-lg md:col-start-2 md:col-end-4 lg:col-end-5"
          classList={{ "md:col-start-3": isEditing() }}
        >
          <Show
            when={nowPlaying() !== undefined}
            fallback={
              <LyricsCardsPreloader canProject={receiverIsAvailable()} />
            }
          >
            {/* Title */}
            <h2
              id="title"
              class="mb-3 text-wrap text-4xl font-black uppercase text-tvc-orange lg:mb-4 lg:text-6xl"
            >
              {toTitleCase(nowPlaying()!.title)}
            </h2>

            {/* Content */}
            <div
              id="content"
              class="grid h-[70dvh] grow grid-cols-1 content-start gap-2 overflow-y-scroll lg:h-[50dvh] lg:grid-cols-3 xl:h-[30dvh]"
              classList={{ "lg:grid-cols-2": isEditing() }}
            >
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
          <footer
            id="controls"
            class="sticky bottom-0 bg-white pt-4 dark:bg-transparent"
          >
            <div class="flex min-h-16 flex-wrap justify-center gap-2 rounded-lg bg-tvc-green p-4 px-6 text-gray-700 lg:justify-between lg:gap-4 dark:bg-teal-700">
              <ProjectionButton
                title="Shift + P"
                isAvailable={receiverIsAvailable()}
                isProjecting={receiverIsConnected()}
                startHandler={openReceiver}
                stopHandler={closeReceiver}
              />
              <DisplayButton
                title="Shift + S"
                isEnabled={receiverIsConnected()}
                isDisplaying={receiverIsVisible()}
                showHandler={() =>
                  showOnReceiver({
                    nowPlaying: nowPlaying(),
                    currentVerseIndex: currentVerseIndex(),
                  })
                }
                hideHandler={hideOnReceiver}
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
