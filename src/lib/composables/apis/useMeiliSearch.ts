import { MeiliSearch } from "meilisearch";

// Import the interfaces...
import { IStatus } from "@interfaces/lyric";

// The name of the index.
const indexId = "lyrics";

// Create the client
const client = new MeiliSearch({
  host: `${import.meta.env.VITE_MEILI_HOST}`,
  apiKey: import.meta.env.VITE_MEILI_MASTER_KEY,
});

// An index is where the documents are stored.
const index = client.index(indexId);

export default () => {
  // Make a GET request for the data.
  const searchMeiliSearch = async (phrase: string) =>
    index.searchGet(phrase, {
      filter: `tenant = ${import.meta.env.VITE_TENANT_ID} AND status = ${IStatus.PUBLISHED}`,
    });

  return {
    searchMeiliSearch,
  };
};
