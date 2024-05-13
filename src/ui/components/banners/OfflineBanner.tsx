import { Show } from "solid-js";
import { type Component } from "solid-js";

const OfflineBanner: Component<{ isOffline: boolean }> = (props) => (
  <Show when={props.isOffline}>
    <div class="fixed top-0 z-30 flex w-full items-center justify-center gap-3 bg-black px-5 py-1.5 text-justify font-serif text-lg font-semibold text-white transition lg:text-lg lg:font-medium">
      <span>You are currently offline.</span>
    </div>
  </Show>
);

export default OfflineBanner;
