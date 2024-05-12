import { Show } from "solid-js";
import { type Component } from "solid-js";

const OfflineBanner: Component<{ isOffline: boolean }> = (props) => (
  <Show when={props.isOffline}>
    <div class="sticky top-0 z-30 flex w-full items-center justify-center gap-3 bg-black px-5 py-1.5 text-justify font-serif text-base font-medium text-white transition">
      <span>You are currently offline.</span>
    </div>
  </Show>
);

export default OfflineBanner;
