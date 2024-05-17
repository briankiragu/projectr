import usePermissionsAPI from "@composables/apis/usePermissionsAPI";

// Import the interfaces...
import type { IProjection } from "@interfaces/projection";

export default () => {
  // Check if the API is available.
  const isAvailable = () =>
    "getScreenDetails" in window || "getScreens" in window;

  // Import the composable methods.
  const { requestWindowManagementPermissions } = usePermissionsAPI();

  const project = async (
    id: string,
    channel: string
  ): Promise<IProjection | undefined> => {
    // If the API is not available, do not project.
    if (!isAvailable) return;

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
      screen: projectionScreen,
      proxy: openPopup(projectionScreen!, id, channel) ?? undefined,
    };
  };

  const openPopup = (
    screen: ScreenDetailed,
    id: string,
    channel: string
  ): WindowProxy | null => {
    // Set the popup configuration.
    const features = [
      `left=${screen.left}`,
      `top=${screen.top}`,
      `width=${screen.width}`,
      `height=${screen.height}`,
    ].join(",");

    return window.open(`/receive/${id}`, `${channel}-${id}`, features);
  };

  return { isAvailable, project };
};
