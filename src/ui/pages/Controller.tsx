import { For, createSignal, onMount, type Component } from "solid-js";

// Import the components...
import OfflineBanner from "@components/banners/OfflineBanner";
import DisplayButton from "@components/buttons/DisplayButton";
import PlaybackButton from "@components/buttons/PlaybackButton";
import ProjectionButton from "@components/buttons/ProjectionButton";

const Controller: Component = () => {
  const [items, setItems] = createSignal<number[]>([]);

  onMount(() => {
    window.addEventListener("click", () => {
      setItems([...items(), items().length]);
    });
  });

  return (
    <div class="flex h-dvh flex-col">
      {/* Offline Banner */}
      <OfflineBanner isOffline={false} />

      <div class="grid grow grid-cols-1 bg-gray-400 lg:grid-cols-4">
        {/* Sidebar */}
        <aside class="col-span-1 flex flex-initial flex-col bg-rose-400">
          {/* Searchbar and search results */}
          <search class="flex h-[50dvh] flex-col bg-yellow-400">
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
              <For each={items()}>
                {(item) => <li class="h-12 bg-indigo-600">{item}</li>}
              </For>
            </ul>
          </search>

          <ul class="h-[50dvh] overflow-y-scroll bg-teal-400">
            <For each={items()}>
              {(item) => <li class="h-12 bg-teal-600">{item}</li>}
            </For>
          </ul>
        </aside>

        <main class="col-span-1 flex flex-col justify-between bg-gray-400 lg:col-span-3">
          {/* Display */}
          <ul class="grid h-[50dvh] grow grid-cols-4 overflow-y-scroll bg-fuchsia-400">
            <For each={items()}>
              {(item) => <li class="col-span-1 h-32 bg-fuchsia-600">{item}</li>}
            </For>
          </ul>

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
