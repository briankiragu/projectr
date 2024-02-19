export default () => {
  const requestWindowManagementPermissions = async (): Promise<string> => {
    let state: string = 'default';

    // The new permission name.
    try {
      ({ state } = await navigator.permissions.query({
        name: 'window-management',
      }));
    } catch (err) {
      if ((err as Error).name !== 'TypeError') {
        return `${(err as Error).name}: ${(err as Error).message}`;
      }
      // The old permission name.
      try {
        ({ state } = await navigator.permissions.query({
          name: 'window-placement',
        }));
      } catch (err) {
        if ((err as Error).name === 'TypeError') {
          console.error('Window management not supported.');
        }
        console.error(`${(err as Error).name}: ${(err as Error).message}`);
      }
    }

    return state;
  };

  return { requestWindowManagementPermissions };
};
