import { type Component } from "solid-js";

// Import the components...
import DisplayButton from "@components/buttons/DisplayButton";
import OfflineBanner from "@components/banners/OfflineBanner";
import PlaybackButton from "@components/buttons/PlaybackButton";
import ProjectionButton from "@components/buttons/ProjectionButton";
import { For } from "solid-js";

const Controller: Component = () => {
  return (
    <div class="flex h-dvh flex-col">
      {/* Offline Banner */}
      <OfflineBanner isOffline={true} />

      <div class="grid grow grid-cols-1 bg-gray-400 lg:grid-cols-4">
        {/* Sidebar */}
        <aside class="col-span-1 flex flex-col bg-rose-400">
          {/* Searchbar and search results */}
          <search class="flex h-[50%] flex-col bg-yellow-400">
            {/* Searchbar */}
            <form class="bg-pink-400">
              <input
                type="search"
                class="w-full"
                placeholder="Search for a track by title, lyrics or author"
              />
            </form>

            {/* Search results */}
            <ul class="overflow-y-scroll bg-indigo-400">
              <For each={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
                {(item) => <li class="h-16 bg-indigo-600">{item}</li>}
              </For>
            </ul>
          </search>

          <div class="h-[50%] bg-green-400"></div>
        </aside>

        <main class="col-span-1 flex flex-col justify-between bg-gray-400 lg:col-span-3">
          {/* Display */}
          <section class="grow overflow-y-scroll bg-fuchsia-400"></section>

          {/* Controls */}
          <footer class="sticky bottom-0 bg-white p-3">
            <div class="flex min-h-16 flex-wrap justify-center gap-4 rounded-lg bg-tvc-green p-4 text-gray-700 md:justify-between md:gap-4 lg:justify-center">
              <ProjectionButton
                title="Shift + P"
                isAvailable={true}
                isProjecting={false}
                startHandler={() => {}}
                stopHandler={() => {}}
              />
              <DisplayButton
                title="Shift + S"
                isEnabled={true}
                isDisplaying={true}
                showHandler={() => {}}
                hideHandler={() => {}}
              />
              <PlaybackButton
                icon="arrow_back"
                text="Previous verse"
                title="ArrowLeft"
                isEnabled={true}
                handler={() => {}}
              />
              <PlaybackButton
                icon="arrow_forward"
                text="Next verse"
                title="ArrowRight"
                isEnabled={true}
                handler={() => {}}
              />
              <PlaybackButton
                icon="skip_next"
                text="Next track"
                title="Shift + ArrowRight"
                isEnabled={true}
                handler={() => {}}
              />
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Controller;
