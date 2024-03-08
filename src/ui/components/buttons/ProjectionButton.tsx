import { type Component, Show } from 'solid-js';

const ProjectionButton: Component<{
  title?: string;
  isEnabled: boolean;
  isProjecting: boolean;
  startHandler: () => void;
  stopHandler: () => void;
}> = (props) => (
  <Show when={props.isEnabled}>
    <button
      type="button"
      title={props.title}
      class="flex h-10 w-10 cursor-pointer gap-3 rounded-full bg-teal-300 p-2 transition-colors hover:bg-teal-700 hover:text-teal-50 md:h-auto md:w-auto md:px-6"
      classList={{ 'bg-teal-700 text-teal-50 hover:bg-indigo-500 hover:text-indigo-50': props.isProjecting }}
      onClick={() => props.isProjecting ? props.stopHandler() : props.startHandler()}
    >
      <span class="material-symbols-outlined">
        {props.isProjecting ? "stop_screen_share" : "screen_share"}
      </span>
      <span class="hidden font-semibold md:inline">
        {props.isProjecting ? "Stop projecting" : "Project"}
      </span>
    </button>
  </Show>
);

export default ProjectionButton;
