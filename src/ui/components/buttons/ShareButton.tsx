import type { Component } from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

const ShareButton: Component<{
  item: IQueueItem;
  shareHandler: (item: IQueueItem) => Promise<false | void>;
}> = (props) => (
  <button
    type="button"
    title={`Share ${props.item.title}`}
    class="relative bottom-1.5 flex items-center justify-center gap-2 rounded-full px-2 py-1.5 text-black transition-colors hover:text-tvc-orange focus:outline-none"
    onClick={() => props.shareHandler(props.item)}
  >
    <span class="material-symbols-outlined text-3xl font-bold transition">
      share
    </span>
  </button>
);

export default ShareButton;
