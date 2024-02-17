export default () => {
  const { isExtended } = window.screen;

  console.dir({ isExtended });

  const requestPermissions = async () => {
    const allScreenDetails = await window.getScreenDetails();
    console.dir(allScreenDetails);

    let state;
    // The new permission name.
    try {
      ({ state } = await navigator.permissions.query({
        name: 'window-management',
      }));
    } catch (err) {
      if (err.name !== 'TypeError') {
        return `${err.name}: ${err.message}`;
      }
      // The old permission name.
      try {
        ({ state } = await navigator.permissions.query({
          name: 'window-placement',
        }));
      } catch (err) {
        if (err.name === 'TypeError') {
          return 'Window management not supported.';
        }
        return `${err.name}: ${err.message}`;
      }
    }
    return state;
  };

  return {
    requestPermissions,
  };
};
