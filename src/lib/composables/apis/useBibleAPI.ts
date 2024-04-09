const url = import.meta.env.VITE_BIBLE_API_URL;
const headers = new Headers({ "api-key": import.meta.env.VITE_BIBLE_API_KEY });

export default () => {
  const getVersions = async () => {
    const query = new URLSearchParams({ language: "eng" });
    const response = await fetch(`${url}?${query.toString()}`, { headers });

    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  };

  const getBooks = async (bibleId: string) => {
    const response = await fetch(`${url}/${bibleId}/books`, { headers });

    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  };

  const getChapters = async (bibleId: string, bookId: string) => {
    const response = await fetch(`${url}/${bibleId}/books/${bookId}/chapters`, {
      headers,
    });

    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  };

  const getVerses = async (bibleId: string, chapterId: string) => {
    const response = await fetch(
      `${url}/${bibleId}/chapters/${chapterId}/verses`,
      { headers }
    );

    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  };

  const getContent = async (bibleId: string, verseId: string) => {
    const response = await fetch(`${url}/${bibleId}/verses/${verseId}`, {
      headers,
    });

    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  };

  return { getVersions, getBooks, getChapters, getVerses, getContent };
};
