import { MeiliSearch } from "meilisearch";

// Import the interfaces...
import { IStatus, type ITrack } from "@interfaces/track";

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
  const searchMeiliSearch = async (phrase: string) =>
    index.searchGet(phrase, { filter: `status = ${IStatus.PUBLISHED}` });

  // Make a POST request to save the data.
  const addDocuments = async (tracks: ITrack[]) => index.addDocuments(tracks);

  return {
    searchMeiliSearch,
    addDocuments,
  };
};
