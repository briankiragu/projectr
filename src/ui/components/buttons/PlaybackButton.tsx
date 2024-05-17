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
    class="flex items-center justify-center gap-2 rounded-full p-2 font-semibold transition-colors hover:bg-gray-600/70 hover:text-gray-50 focus:outline-none lg:h-auto lg:w-auto lg:rounded-lg lg:px-4"
    classList={{
      "hover:bg-transparent disabled:text-gray-300 hover:cursor-not-allowed":
        !props.isEnabled,
    }}
    disabled={!props.isEnabled}
    onClick={() => props.handler()}
  >
    <span class="material-symbols-outlined transition">{props.icon}</span>
    <span class="hidden lg:inline">{props.text}</span>
  </button>
);

export default PlaybackButton;
