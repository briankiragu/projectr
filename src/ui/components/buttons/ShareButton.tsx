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
    class="flex size-12 items-center justify-center gap-2 rounded-full bg-tvc-orange font-bold text-white transition-colors hover:bg-tvc-green hover:text-gray-50 focus:outline-none"
    onClick={() => props.shareHandler(props.item)}
  >
    <span class="material-symbols-outlined text-3xl transition">share</span>
  </button>
);

export default ShareButton;
