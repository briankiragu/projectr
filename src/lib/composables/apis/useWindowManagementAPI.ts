import usePermissionsAPI from "@composables/apis/usePermissionsAPI";

type IProjectionPayload = {
  projectionScreen: ScreenDetailed;
  proxy: WindowProxy | undefined;
};

export default () => {
  // Check if the API is supported.
  const isSupported = () =>
    "getScreenDetails" in window || "getScreens" in window;

  // Import the composable methods.
  const { requestWindowManagementPermissions } = usePermissionsAPI();

  const project = async (
    channel: string
  ): Promise<IProjectionPayload | undefined> => {
    // If the API is not supported, do not project.
    if (!isSupported) return;

    // Request the permissions.
    const isEnabled: boolean =
      (await requestWindowManagementPermissions()) === "granted";

    // If the permission is blocked, notify the user.
    if (!isEnabled) {
      window.alert(
        `Your BROWSER does not support multi-window management or it has been blocked.`
      );
      return;
    }

    // Get the screen details.
    const { screens } = await window.getScreenDetails();

    // Check if the display is extended.
    const { isExtended } = window.screen;

    // Attempt to get the extended screen first, if not
    // return the primary screen.
    const [projectionScreen] = screens.filter((screen) =>
      isExtended ? screen.isExtended : screen.isPrimary
    );

    // Open the popup with the correct data.
    return {
      projectionScreen,
      proxy: openPopup(projectionScreen!, channel) ?? undefined,
    };
  };

  const openPopup = (
    screen: ScreenDetailed,
    channel: string
  ): WindowProxy | null => {
    // Set the popup configuration.
    const features = [
      `left=${screen.left}`,
      `top=${screen.top}`,
      `width=${screen.width}`,
      `height=${screen.height}`,
    ].join(",");

    return window.open("/project", channel, features);
  };

  return { isSupported, project };
};
