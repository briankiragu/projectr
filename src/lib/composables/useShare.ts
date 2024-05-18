import useWebShareAPI from "@composables/apis/useWebShareAPI";
import useFormatting from "@composables/useFormatting";
import type { IQueueItem } from "@interfaces/queue";

export default () => {
  const { toEditableLyrics } = useFormatting();
  const { share } = useWebShareAPI();

  const shareItem = async (item: IQueueItem) =>
    await share({ title: item.title, text: toEditableLyrics(item.content) });

  return { shareItem };
};
