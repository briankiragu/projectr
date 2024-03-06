import { type Component } from 'solid-js';

const LyricsCardsPreloader: Component = () => {
  return (
    <div class="flex-1 hidden grid-cols-1 gap-4 md:grid md:grid-cols-3 md:overflow-y-scroll">
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
      <div class="rounded-md bg-gray-200/40"></div>
    </div>
  );
};

export default LyricsCardsPreloader;
