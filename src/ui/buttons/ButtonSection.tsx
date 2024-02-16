import { Component } from 'solid-js';

const ButtonSection: Component<{
  isEnabled: boolean;
  text: string;
  handler?: () => void;
}> = (props) => {
  return (
    <button
      class="rounded-md px-2.5 transition-colors hover:bg-gray-400  hover:text-gray-50"
      classList={{
        'hover:bg-gray-200 disabled:text-gray-300': !props.isEnabled,
      }}
      disabled={!props.isEnabled}
      onClick={props.handler}
    >
      {props.text}
    </button>
  );
};

export default ButtonSection;
