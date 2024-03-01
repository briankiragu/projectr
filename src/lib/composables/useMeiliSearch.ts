import { MeiliSearch } from 'meilisearch';
import data from '../../data/sample';

export default () => {
  // The name of the index.
  const indexId = 'tracks';
  const primaryKey = 'id';

  // Create the client
  const client = new MeiliSearch({
    host: import.meta.env.VITE_MEILI_HOST,
    apiKey: import.meta.env.VITE_MEILI_MASTER_KEY,
  });

  const init = async () => {
    // Create the index.
    client.createIndex(indexId, { primaryKey });

    // An index is where the documents are stored.
    const index = client.index(indexId);

    // If the index 'movies' does not exist, Meilisearch creates it when you first add the documents.
    await index.addDocuments(data);
  };

  const search = async (phrase: string) => {
    // An index is where the documents are stored.
    const index = client.index(indexId);

    return index.searchGet(phrase);
  };

  return {
    init,
    search,
  };
};
