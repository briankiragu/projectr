import { MeiliSearch } from "meilisearch";

export default () => {
  // The name of the index.
  const indexId = "tracks";

  // Create the client
  const client = new MeiliSearch({
    host: import.meta.env.VITE_MEILI_HOST,
    apiKey: import.meta.env.VITE_MEILI_MASTER_KEY,
  });

  // An index is where the documents are stored.
  const index = client.index(indexId);

  // Make a GET request for the data.
  const searchMeiliSearch = async (phrase: string) => index.searchGet(phrase);

  return {
    searchMeiliSearch,
  };
};
