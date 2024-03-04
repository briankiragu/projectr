import { type Component, Show } from 'solid-js';

// Import the composables.
import useWindowManagementAPI from '@composables/useWindowManagementAPI';

const ProjectionButton: Component<{
  isProjecting: boolean;
  openHandler: () => void;
  closeHandler: () => void;
}> = (props) => {
  // Import the composable property.
  const { isSupported } = useWindowManagementAPI();

  return (
    <Show when={isSupported}>
      <button
        type="button"
<<<<<<< HEAD
        class="flex h-10 w-10 cursor-pointer gap-3 rounded-full bg-teal-300 p-2 transition-colors hover:bg-teal-700 hover:text-teal-50 lg:h-auto lg:w-auto lg:px-6"
        classList={{ 'bg-teal-700 text-teal-50 hover:bg-purple-800 hover:text-purple-50': props.isProjecting }}
        onClick={props.isProjecting ? props.closeHandler : props.openHandler}
=======
        class="flex h-10 w-10 cursor-pointer gap-3 rounded-full bg-teal-300 p-2 text-teal-800 transition-colors hover:bg-teal-700 hover:text-teal-50 lg:h-auto lg:w-auto lg:px-6"
        classList={{ 'bg-teal-700 text-teal-50': isProjecting }}
        onClick={handler}
>>>>>>> f34cbfe (ui: Add background image to resting page)
      >
        <span class="material-symbols-outlined">
          {props.isProjecting ? 'stop_screen_share' : 'screen_share'}
        </span>
        <span class="hidden font-semibold lg:inline">
          {props.isProjecting ? 'Stop projecting' : 'Project'}
        </span>
      </button>
    </Show>
  );
};

export default ProjectionButton;
