import { createSignal } from "solid-js";

// Import composables.
import useWindowManagementAPI from "@composables/apis/useWindowManagementAPI";
import type { IProjectionPayload } from "@interfaces/projection";

export default (channel: BroadcastChannel) => {
  // Import the composables.
  const { isSupported, project } = useWindowManagementAPI();

  const [extendedScreen, setExtendedScreen] = createSignal<
    ScreenDetailed | undefined
  >(undefined);
  const [projection, setProjection] = createSignal<WindowProxy | undefined>(
    undefined
  );
  const [isVisible, setIsVisible] = createSignal<boolean>(true);

  const isProjecting = (): boolean => projection() !== undefined;

  const openProjection = async () => {
    const payload = await project(import.meta.env.VITE_BROADCAST_NAME);

    if (payload !== undefined) {
      setExtendedScreen(payload.extendedScreen);
      setProjection(payload.proxy);
    }
  };

  const expandToFullscreen = async () => {
    await document.body.requestFullscreen({ screen: extendedScreen() });
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
    setIsVisible(true);
  };

  return {
    projection,
    isVisible,

    isSupported,
    isProjecting,

    openProjection,
    expandToFullscreen,
    showProjection,
    hideProjection,
    closeProjection,
  };
};
