import { Show, createSignal, onMount } from "solid-js";
import { type Component } from "solid-js";

const OfflineBanner: Component = () => {
  const [isOffline, setIsOffline] = createSignal<boolean>(false);

  onMount(() => {
    window.addEventListener("offline", () => {
      setIsOffline(true);
    });

    window.addEventListener("online", () => {
      setIsOffline(false);
    });
  });

  return (
    <Show when={isOffline()}>
      <div class="w-full bg-black py-1.5 text-center text-sm text-white transition">
        You are currently offline...
      </div>
    </Show>
  );
};

export default OfflineBanner;
