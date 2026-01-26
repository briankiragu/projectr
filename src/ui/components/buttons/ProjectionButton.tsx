import { type Component, createSignal, Show } from "solid-js";
import { IProjectionScreenTypes } from "@interfaces/projection";

const ProjectionButton: Component<{
  title?: string;
  isAvailable: boolean;
  isProjecting: boolean;
  startHandler: (screenType: IProjectionScreenTypes) => void;
  stopHandler: () => void;
}> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  const handleLaunch = (screenType: IProjectionScreenTypes) => {
    props.startHandler(screenType);
    setIsDropdownOpen(false);
  };

  return (
    <div class="relative flex w-24 gap-0.5 lg:w-80">
      {/* Start projection dropdown */}
      <div class="relative">
        <button
          type="button"
          title={props.title}
          class="group flex cursor-pointer items-center gap-3 p-2 px-3 font-semibold transition-colors hover:bg-teal-700 hover:text-teal-50 focus:outline-none lg:h-auto lg:w-auto lg:px-4 xl:px-5"
          classList={{
            "bg-teal-300 dark:bg-teal-400 dark:hover:bg-teal-900":
              props.isAvailable,
            "hover:bg-transparent dark:disabled:text-gray-400 disabled:text-gray-300 hover:cursor-not-allowed":
              !props.isAvailable,
            "rounded-l-lg": props.isProjecting,
            "rounded-full lg:rounded-lg": !props.isProjecting,
          }}
          disabled={!props.isAvailable}
          onClick={() => setIsDropdownOpen(!isDropdownOpen())}
        >
          <span
            class="material-symbols-outlined transition"
            classList={{ "group-hover:text-sky-600": props.isProjecting }}
          >
            screen_share
          </span>
          <span class="hidden lg:inline">Launch projection</span>
          <span class="material-symbols-outlined hidden text-sm lg:inline">
            {isDropdownOpen() ? "expand_less" : "expand_more"}
          </span>
        </button>

        {/* Dropdown menu */}
        <Show when={isDropdownOpen() && props.isAvailable}>
          <div class="absolute bottom-full left-0 z-50 mb-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left font-medium text-gray-700 transition hover:bg-teal-100 dark:text-gray-200 dark:hover:bg-teal-900"
              onClick={() => handleLaunch(IProjectionScreenTypes.audience)}
            >
              <span class="material-symbols-outlined text-xl">groups</span>
              Audience view
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left font-medium text-gray-700 transition hover:bg-teal-100 dark:text-gray-200 dark:hover:bg-teal-900"
              onClick={() => handleLaunch(IProjectionScreenTypes.prompter)}
            >
              <span class="material-symbols-outlined text-xl">aod_tablet</span>
              Prompter view
            </button>
          </div>
        </Show>
      </div>

      {/* Stop projection */}
      <button
        type="button"
        title={props.title}
        class="flex cursor-pointer gap-3 rounded-r-xl p-2 px-3 font-semibold transition focus:outline-none lg:h-auto lg:w-auto lg:px-3"
        classList={{
          "bg-teal-700 text-teal-50 hover:bg-pink-700 hover:text-pink-50 dark:bg-teal-900":
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
};

export default ProjectionButton;
