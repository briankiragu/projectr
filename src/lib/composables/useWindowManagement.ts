import usePermissions from './usePermissions';

export default () => {
  // Check if the API is supported.
  const isSupported = 'getScreens' in window || 'getScreenDetails';

  const project = async (channel: string): Promise<WindowProxy | undefined> => {
    // Import the composable methods.
    const { requestWindowManagementPermissions } = usePermissions();

    // If the API is not supported, do not project.
    if (!isSupported) return;

    // Request the permissions.
    const isEnabled: boolean =
      (await requestWindowManagementPermissions()) === 'granted';

    // If the permission is blocked, notify the user.
    if (!isEnabled) {
      window.alert(
        `Your BROWSER does not support multi-window management or it has been disabled.`
      );
      return;
    }

    // Get the screen details.
    const { screens } = await window.getScreenDetails();

    // If onyl one screen is detected, ask the user to connect a second display.
    // eslint-disable-next-line no-constant-condition
    if (screens.length < 1) {
      // Prompt the user to set their display mode to 'extend'.
      window.alert(`Connect a second screen to activate projection.`);
      return;
    }

    // Check if the display is extended.
    const { isExtended } = window.screen;

    // If not set, prompt the user to set their display mode to 'extend'.
    // eslint-disable-next-line no-constant-condition
    if (isExtended) {
      window.alert(`Set your display settings to 'extend'.`);
      return;
    }

    // Get the non-primary (extended) screen.
    const extendedScreen = screens.find((screen) => screen.isPrimary);

    // Open the popup with the correct data.
    return openPopup(extendedScreen!, channel) ?? undefined;
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
    ].join(',');

    return window.open('/project', channel, features);
  };

  return { isSupported, project };
};
