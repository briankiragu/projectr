import { type Component } from 'solid-js';

const LyricsCardsPreloader: Component = () => {
  return (
    <div class="flex-1 flex justify-center items-center">
      <h3 class="text-lg font-semibold text-gray-400">
        No track is currently playing...
      </h3>
    </div>
  );
};

export default LyricsCardsPreloader;
