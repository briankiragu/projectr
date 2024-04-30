import { type Component } from "solid-js";

const ProjectionButton: Component<{
  title?: string;
  isAvailable: boolean;
  isProjecting: boolean;
  startHandler: () => void;
  stopHandler: () => void;
}> = (props) => (
  <button
    type="button"
    title={props.title}
    class="relative flex cursor-pointer gap-3 rounded-full bg-teal-300 p-2 transition-colors hover:bg-teal-700 hover:text-teal-50 focus:outline-none md:h-auto md:w-auto md:px-6"
    classList={{
      disabled: !props.isAvailable,
      "bg-teal-700 text-teal-50 hover:bg-indigo-500 hover:text-indigo-50":
        props.isProjecting,
    }}
    disabled={!props.isAvailable}
    onClick={() =>
      props.isProjecting ? props.stopHandler() : props.startHandler()
    }
  >
    <span class="material-symbols-outlined transition">
      {props.isProjecting ? "stop_screen_share" : "screen_share"}
    </span>
    <span class="hidden font-semibold md:inline">
      {props.isProjecting ? "Stop projecting" : "Project"}
    </span>
  </button>
);

export default ProjectionButton;
