import { type Component } from 'solid-js';

const LyricsCardsPreloader: Component = () => {
  return (
    <div class="h-42 hidden grid-cols-1 gap-4 lg:grid lg:h-80 lg:grid-cols-3 lg:overflow-y-scroll lg:pb-2">
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
    </div>
  );
};

export default LyricsCardsPreloader;
