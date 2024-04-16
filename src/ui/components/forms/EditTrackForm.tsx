import { type Component, createSignal } from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables...
import useFormatting from "@composables/useFormatting";

const EditTrackForm: Component<{
  track: IQueueItem;
  handler: (track: IQueueItem) => void;
}> = (props) => {
  const { toEditableLyrics, fromEditableLyrics } = useFormatting();
  const [live, setLive] = createSignal<string>(
    toEditableLyrics(props.track.content)
  );

  return (
    <form
      class="flex flex-col gap-3 text-sm text-gray-500"
      onSubmit={(e) => {
        e.preventDefault();
        props.handler({ ...props.track!, content: fromEditableLyrics(live()) });
      }}
    >
      <h3 class="font-semibold italic text-teal-800">
        Make live changes to the current track
      </h3>

      {/* Lyrics */}
      <label for="live-edit" class="grow">
        <textarea
          name="live-edit"
          id="live-edit"
          rows="29"
          class="w-full rounded-md px-3 py-2"
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

export default EditTrackForm;
