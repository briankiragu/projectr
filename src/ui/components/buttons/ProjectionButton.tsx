import { type Component } from "solid-js";

const ProjectionButton: Component<{
  title?: string;
  isAvailable: boolean;
  isProjecting: boolean;
  startHandler: () => void;
  stopHandler: () => void;
}> = (props) => (
  <div class="relative flex w-28 gap-0.5 lg:w-[18.5rem]">
    {/* Start projection */}
    <button
      type="button"
      title={props.title}
      class="flex cursor-pointer gap-3 p-2 font-semibold transition-colors hover:bg-teal-700 hover:text-teal-50 focus:outline-none md:h-auto md:w-auto md:px-6"
      classList={{
        "bg-teal-300": props.isAvailable,
        "hover:bg-transparent disabled:text-gray-300 hover:cursor-not-allowed":
          !props.isAvailable,
        "rounded-l-full px-3": props.isProjecting,
        "rounded-full": !props.isProjecting,
      }}
      disabled={!props.isAvailable}
      onClick={() => props.startHandler()}
    >
      <span class="material-symbols-outlined transition">screen_share</span>
      <span class="hidden md:inline">Launch projection</span>
    </button>

    {/* Stop projection */}
    <button
      type="button"
      title={props.title}
      class="flex cursor-pointer gap-3 rounded-r-full p-2 px-3 font-semibold transition focus:outline-none md:h-auto md:w-auto md:px-3"
      classList={{
        "bg-teal-700 text-teal-50 hover:bg-pink-700 hover:text-pink-50":
          props.isProjecting,
        hidden: !props.isProjecting,
      }}
      disabled={!props.isProjecting}
      onClick={() => props.stopHandler()}
    >
      <span class="material-symbols-outlined transition">
        stop_screen_share
      </span>
    </button>
  </div>
);

export default ProjectionButton;
