import { type Component } from "solid-js";

const DisplayButton: Component<{
  title?: string;
  isEnabled: boolean;
  isDisplaying: boolean;
  showHandler: () => void;
  hideHandler: () => void;
}> = (props) => (
  <button
    type="button"
    title={props.title}
    class="flex items-center justify-center gap-2 rounded-full p-2 font-semibold transition hover:bg-gray-600/70 hover:text-gray-50 focus:outline-none lg:h-auto lg:w-auto lg:rounded-lg lg:px-4"
    classList={{
      "hover:bg-transparent disabled:text-gray-300 hover:cursor-not-allowed":
        !props.isEnabled,
    }}
    disabled={!props.isEnabled}
    onClick={() =>
      props.isDisplaying ? props.hideHandler() : props.showHandler()
    }
  >
    <span class="material-symbols-outlined transition">
      {props.isDisplaying ? "visibility_off" : "visibility"}
    </span>
    <span class="hidden w-24 font-semibold lg:inline">
      {props.isDisplaying ? "Hide lyrics" : "Show lyrics"}
    </span>
  </button>
);

export default DisplayButton;
