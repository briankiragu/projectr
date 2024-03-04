import { createSignal } from "solid-js";

export default (channel: BroadcastChannel) => {
  const [projection, setProjection] = createSignal<WindowProxy | undefined>(
    undefined
  );

  const isProjecting = (): boolean => projection() !== undefined;

  const clearProjection = () => {
    channel.postMessage(null);
  };

  const closeProjection = () => {
    projection()?.close();
  };

  return {
    projection,
    setProjection,
    isProjecting,
    clearProjection,
    closeProjection,
  };
};
