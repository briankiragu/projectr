import { MeiliSearch } from "meilisearch";

// Import the interfaces.
import { ISource, type ITrack } from "@interfaces/track";

// The name of the index.
const indexId = "tracks";

// Create the client
const client = new MeiliSearch({
  host: import.meta.env.VITE_MEILI_HOST,
  apiKey: import.meta.env.VITE_MEILI_MASTER_KEY,
});

// An index is where the documents are stored.
const index = client.index(indexId);

export default () => {
  // Make a GET request for the data.
  const searchMeiliSearch = async (phrase: string): Promise<ITrack[]> => {
    const { hits } = await index.searchGet(phrase);
    return (hits as ITrack[]).map((hit) => ({ ...hit, source: ISource.meili }));
  };

  return {
    searchMeiliSearch,
  };
};
