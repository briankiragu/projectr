import { type Component } from "solid-js";

const PlaybackButton: Component<{
  isEnabled: boolean;
  icon: string;
  text: string;
  title?: string;
  handler: () => void;
}> = (props) => (
  <button
    type="button"
    title={props.title}
    class="group flex items-center justify-center gap-2 rounded-full p-2 font-semibold transition hover:bg-gray-600/70 hover:text-gray-50 focus:outline-hidden lg:h-auto lg:w-auto lg:rounded-lg lg:px-4 dark:text-gray-200"
    classList={{
      "hover:bg-transparent disabled:text-gray-300 dark:disabled:text-gray-400 hover:cursor-not-allowed":
        !props.isEnabled,
      "dark:hover:bg-gray-700/90": props.isEnabled,
    }}
    disabled={!props.isEnabled}
    onClick={() => props.handler()}
  >
    <span
      class="material-symbols-outlined transition"
      classList={{ "group-hover:text-sky-600": props.isEnabled }}
    >
      {props.icon}
    </span>
    <span class="hidden lg:inline">{props.text}</span>
  </button>
);

export default PlaybackButton;
