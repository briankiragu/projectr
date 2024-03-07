import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/useWindowManagementAPI";
import { IProjectionPayload } from "../interfaces/projection";

export default (channel: BroadcastChannel) => {
  // Import the composables.
  const { isSupported, project } = useWindowManagementAPI();

  const [projection, setProjection] = createSignal<WindowProxy | undefined>(
    undefined
  );
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isProjecting = (): boolean => projection() !== undefined;

  const openProjection = async () => {
    setProjection(await project(import.meta.env.VITE_BROADCAST_NAME));
  };

  const showProjection = (data: IProjectionPayload | null) => {
    setIsVisible(true);
    channel.postMessage(JSON.stringify(data));
  };

  const hideProjection = () => {
    setIsVisible(false);
    channel.postMessage(null);
  };

  const closeProjection = () => {
    projection()?.close();

    setProjection(undefined);
    setIsVisible(false);
  };

  return {
    projection,

    isSupported,
    isProjecting,
    isVisible,

    openProjection,
    showProjection,
    hideProjection,
    closeProjection,
  };
};
