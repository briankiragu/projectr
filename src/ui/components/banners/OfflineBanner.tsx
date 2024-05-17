import { type Component } from "solid-js";

const OfflineBanner: Component = () => (
  <div class="sticky top-0 z-30 flex w-full items-center justify-center gap-3 bg-black px-5 py-1 text-justify font-serif text-lg font-semibold text-white transition lg:text-base lg:font-medium">
    <span>You are currently offline.</span>
  </div>
);

export default OfflineBanner;
