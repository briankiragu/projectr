import { Component } from 'solid-js';

const ButtonPlayback: Component<{
  isEnabled: boolean;
  text: string;
  handler?: () => void;
}> = (props) => {
  return (
    <button
      class="h-8 w-8 rounded-full p-1 transition-colors hover:bg-gray-400"
      classList={{
        'hover:bg-gray-200 disabled:text-gray-300': !props.isEnabled,
      }}
      disabled={!props.isEnabled}
      onClick={props.handler}
    >
      <span class="material-symbols-outlined">{props.text}</span>
    </button>
  );
};

export default ButtonPlayback;
