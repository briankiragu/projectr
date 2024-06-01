import { type Component } from "solid-js";

const ProjectionButton: Component<{
  title?: string;
  isAvailable: boolean;
  isProjecting: boolean;
  startHandler: () => void;
  stopHandler: () => void;
}> = (props) => (
  <div class="relative flex w-24 gap-0.5 lg:w-72">
    {/* Start projection */}
    <button
      type="button"
      title={props.title}
      class="group flex cursor-pointer items-center gap-3 p-2 px-3 font-semibold transition-colors hover:bg-teal-700 hover:text-teal-50 focus:outline-none lg:h-auto lg:w-auto lg:px-4 xl:px-5 dark:hover:bg-gray-700"
      classList={{
        "bg-teal-300 dark:bg-teal-400": props.isAvailable,
        "hover:bg-transparent dark:disabled:text-gray-400 disabled:text-gray-300 hover:cursor-not-allowed":
          !props.isAvailable,
        "rounded-l-xl": props.isProjecting,
        "rounded-full lg:rounded-xl": !props.isProjecting,
      }}
      disabled={!props.isAvailable}
      onClick={() => props.startHandler()}
    >
      <span
        class="material-symbols-outlined transition"
        classList={{ "group-hover:text-sky-600": props.isProjecting }}
      >
        screen_share
      </span>
      <span class="hidden lg:inline">Launch projection</span>
    </button>

    {/* Stop projection */}
    <button
      type="button"
      title={props.title}
      class="flex cursor-pointer gap-3 rounded-r-xl  p-2 px-3 font-semibold transition focus:outline-none lg:h-auto lg:w-auto lg:px-3"
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
