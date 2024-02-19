import { Component, Show } from 'solid-js';

// Import the composables.
import useWindowManagement from '../../lib/composables/useWindowManagement';

const ProjectionButton: Component<{ handler?: () => void }> = (props) => {
  // Import the composable property.
  const { isSupported } = useWindowManagement();

  return (
    <Show when={isSupported}>
      <div class="flex h-10 w-10 cursor-pointer gap-3 rounded-full bg-teal-300 p-2 text-teal-800 transition-colors hover:bg-teal-700 hover:text-teal-50 lg:h-auto lg:w-auto lg:px-6">
        <span class="material-symbols-outlined" onClick={props.handler}>
          screen_share
        </span>
        <span class="hidden font-semibold lg:inline">Project</span>
      </div>
    </Show>
  );
};

export default ProjectionButton;
