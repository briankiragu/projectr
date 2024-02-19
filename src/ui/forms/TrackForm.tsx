import { Component } from 'solid-js';
import { ITrack } from '../../interfaces/track';
import useTracks from '../../lib/composables/useTracks';

const TrackForm: Component<{
  track?: ITrack;
  handler: (track: ITrack) => void;
}> = (props) => {
  const { toEditable } = useTracks();

  return (
    <form class="flex flex-col gap-3 text-sm text-gray-500">
      <label for="title">
        <input
          type="text"
          name="title"
          id="title"
          class="w-full rounded px-3 py-2"
          value={props.track?.title}
        />
      </label>

      <label for="live-edit">
        <textarea
          name="live-edit"
          id="live-edit"
          rows="25"
          class="w-full px-3 py-2"
        >
          {toEditable(props.track)}
        </textarea>
      </label>
    </form>
  );
};

export default TrackForm;
