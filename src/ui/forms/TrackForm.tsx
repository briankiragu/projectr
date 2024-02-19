import { Component, createSignal } from 'solid-js';
import { ITrack } from '../../interfaces/track';
import useTracks from '../../lib/composables/useTracks';

const TrackForm: Component<{
  track?: ITrack;
  handler: (lyrics: string[][], id?: number) => void;
}> = (props) => {
  const { toEditable, fromEditable } = useTracks();
  const [live, setLive] = createSignal(toEditable(props.track?.lyrics));

  return (
    <form
      class="flex flex-col gap-3 text-sm text-gray-500"
      onSubmit={(e) => {
        e.preventDefault();
        props.handler(fromEditable(live()), props.track?.id);
      }}
    >
      <h3 class="font-semibold italic text-teal-800">
        Make live changes to the current track
      </h3>

      {/* Lyrics */}
      <label for="live-edit">
        <textarea
          name="live-edit"
          id="live-edit"
          rows="25"
          class="w-full rounded-md px-3 py-2"
          onInput={(e) => setLive(e.target.value)}
        >
          {live()}
        </textarea>
      </label>

      {/* Submit */}
      <button
        type="submit"
        class="rounded-md bg-teal-600 py-3 text-teal-50 shadow-md shadow-teal-600/60"
      >
        Publish changes
      </button>
    </form>
  );
};

export default TrackForm;
