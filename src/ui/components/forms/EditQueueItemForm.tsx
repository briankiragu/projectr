import { type Component, createSignal } from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";

const EditQueueItemForm: Component<{
  item: IQueueItem;
  handler: (item: IQueueItem) => void;
}> = (props) => {
  const { toEditableLyrics, fromEditableLyrics } = useFormatting();
  const [live, setLive] = createSignal<string>(
    toEditableLyrics(props.item.content)
  );

  return (
    <form
      class="flex flex-col gap-3 text-sm text-gray-500"
      onSubmit={(e) => {
        e.preventDefault();
        props.handler({ ...props.item!, content: fromEditableLyrics(live()) });
      }}
    >
      <h3 class="font-semibold italic text-teal-800">
        Make live changes to the current item
      </h3>

      {/* Lyrics */}
      <label for="live-edit" class="grow">
        <textarea
          name="live-edit"
          id="live-edit"
          rows="30"
          class="h-full w-full rounded-md px-3 py-2"
          onInput={(e) => setLive(e.target.value)}
        >
          {live()}
        </textarea>
      </label>

      {/* Submit */}
      <button
        type="submit"
        class="rounded-md bg-teal-600 py-3 font-semibold text-teal-50 shadow-md shadow-teal-700/60"
      >
        Publish changes
      </button>
    </form>
  );
};

export default EditQueueItemForm;
