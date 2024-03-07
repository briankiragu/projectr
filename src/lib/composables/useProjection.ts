import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/useWindowManagementAPI";

export default (channel: BroadcastChannel) => {
  const { project } = useWindowManagementAPI();

  const [projection, setProjection] = createSignal<WindowProxy | undefined>(
    undefined
  );

  const isProjecting = (): boolean => projection() !== undefined;

  const startProjection = async () => {
    setProjection(await project(import.meta.env.VITE_BROADCAST_NAME));
  };

  const clearProjection = () => {
    channel.postMessage(null);
  };

  const closeProjection = () => {
    projection()?.close();
    setProjection(undefined);
  };

  return {
    projection,
    setProjection,

    isProjecting,

    startProjection,
    clearProjection,
    closeProjection,
  };
};
