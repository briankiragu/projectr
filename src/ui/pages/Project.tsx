import { type Component, createSignal, lazy } from 'solid-js';

// Import components.
const LyricsPreviewCard = lazy(
  () => import('@components/cards/LyricsPreviewCard')
);

const Project: Component = () => {
  // Create a broadcast channel.
  const broadcast = new BroadcastChannel('projectr');

  // To hold the data from the broadcast channel.
  const [verse, setVerse] = createSignal<string[]>([]);

  // When a message relays on the channel.
  broadcast.addEventListener('message', (e: Event) => {
    const data = JSON.parse((e as MessageEvent).data);
    setVerse(data);
  });

  return (
    <div class="h-screen p-4">
      <LyricsPreviewCard verse={verse()} />
    </div>
  );
};

export default Project;
