import usePermissionsAPI from "./usePermissionsAPI";

export default () => {
  const { requestWebSharePermissions } = usePermissionsAPI();

  const share = async (data: { title: string; text: string }) => {
    requestWebSharePermissions();
    return navigator.canShare(data) && (await navigator.share(data));
  };

  return { share };
};
