import { Component, For, createSignal } from 'solid-js';

const LyricsProjectionCard: Component = () => {
  const [verse] = createSignal<string[]>([
    'WEKA SIFA MBELE (SEND JUDAH [PRAISE] FIRST),',
    'KWA KUIMBA NA KUABUDU (PRAISING AND WORSHIPPING),',
    'PIGA KELELE (SHOUT FOR JOY),',
    'KUTA ZOTE NITA SHUSHA (AND I WILL TEAR DOWN THE WALLS),',
    'WEKA SIFA MBELE (SEND JUDAH [PRAISE] FIRST),',
    'UFIKAPO JERICHO (WHEN YOU GET TO JERICHO),',
    'PIGA KELELE (SHOUT FOR JOY),',
    'KUTA ZOTE NITA SHUSHA (AND I WILL TEAR DOWN THE WALLS),',
  ]);

  return (
    <div class="h-screen p-4">
      <div class="relative flex h-full flex-col justify-center gap-4 rounded-lg bg-teal-600 p-4 text-center text-teal-50 shadow-lg shadow-teal-600/20">
        <For each={verse()}>
          {(line) => (
            <p class="text-wrap text-5xl font-extrabold uppercase lg:text-5xl">
              {line}
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

export default LyricsProjectionCard;
