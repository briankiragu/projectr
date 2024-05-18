import usePermissionsAPI from "./usePermissionsAPI";

export default () => {
  const { requestWebSharePermissions } = usePermissionsAPI();

  const share = async (data: { title: string; text: string }) => {
    // navigator.canShare(data) &&
    requestWebSharePermissions();
    return await navigator.share(data);
  };

  return { share };
};
