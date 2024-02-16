import { MeiliSearch } from 'meilisearch';
import data from '../../data/sample';

export default () => {
  // Create the client
  const client = new MeiliSearch({
    host: 'http://127.0.0.1:7700',
    apiKey: '018db27a-b774-78af-9756-6531be6607a3',
  });

  // The name of the index.
  const indexId = 'tracks';
  const primaryKey = 'title';

  const init = async () => {
    // Create the index.
    client.createIndex(indexId, { primaryKey });

    // An index is where the documents are stored.
    const index = client.index(indexId);

    // If the index 'movies' does not exist, Meilisearch creates it when you first add the documents.
    await index.addDocuments(data);
  };

  const search = async (phrase: string) => {
    console.dir(phrase);
    // An index is where the documents are stored.
    const index = client.index(indexId);

    return index.search(phrase);
  };

  return {
    init,
    search,
  };
};
