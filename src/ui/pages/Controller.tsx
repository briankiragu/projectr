import OfflineBanner from "@components/banners/OfflineBanner";
import DisplayButton from "@components/buttons/DisplayButton";
import PlaybackButton from "@components/buttons/PlaybackButton";
import ProjectionButton from "@components/buttons/ProjectionButton";
import type { Component } from "solid-js";

const Controller: Component = () => {
  return (
    <div class="flex h-dvh flex-col justify-between">
      {/* Offline Banner */}
      <OfflineBanner isOffline={true} />

      <div class="grid h-full grid-cols-1 bg-gray-100">
        {/* Sidebar */}
        <aside class="col-span-1 h-full bg-gray-200"></aside>

        <main class="col-span-1 flex flex-col justify-between bg-gray-300">
          {/* Display */}
          <section class="bg-gray-400"></section>

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
