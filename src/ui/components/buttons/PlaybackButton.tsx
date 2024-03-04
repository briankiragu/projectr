import { type Component } from 'solid-js';

const PlaybackButton: Component<{
  shortcut?: string;
  isEnabled: boolean;
  icon: string;
  text: string;
  handler?: () => void;
}> = (props) => {

  return (
    <button
      type="button"
      title={props.shortcut}
      class="flex h-10 w-10 items-center justify-center gap-2 rounded-full font-semibold transition-colors hover:bg-gray-600/70 hover:text-gray-50 lg:h-auto lg:w-auto lg:rounded-lg lg:px-4"
      classList={{
        'hover:bg-transparent disabled:text-gray-300 hover:cursor-not-allowed': !props.isEnabled,
      }}
      disabled={!props.isEnabled}
      onClick={props.handler}
    >
      <span class="material-symbols-outlined">{props.icon}</span>
      <span class="hidden lg:inline">{props.text}</span>
    </button>
  );
};

export default PlaybackButton;
