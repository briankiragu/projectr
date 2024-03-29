import { type Component } from 'solid-js';

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
    class="flex items-center justify-center gap-2 p-2 rounded-full font-semibold transition hover:bg-gray-600/70 hover:text-gray-50 md:h-auto md:w-auto md:rounded-lg md:px-4 focus:outline-none"
    classList={{
      'hover:bg-transparent disabled:text-gray-300 hover:cursor-not-allowed': !props.isEnabled,
    }}
    disabled={!props.isEnabled}
    onClick={() => props.isDisplaying ? props.hideHandler() : props.showHandler()}
  >
    <span class="material-symbols-outlined transition">
      {props.isDisplaying ? "visibility_off" : "visibility"}
    </span>
    <span class="hidden font-semibold md:inline">
      {props.isDisplaying ? "Hide lyrics" : "Show lyrics"}
    </span>
  </button>
);

export default DisplayButton;
