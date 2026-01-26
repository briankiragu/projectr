import type {
  IBibleBook,
  IBibleChapter,
  IBibleVerse,
  IBibleVerseContent,
  IBibleVersion,
} from "@interfaces/bible";

const url = import.meta.env.VITE_BIBLE_API_URL;
const headers = new Headers({ "api-key": import.meta.env.VITE_BIBLE_API_KEY });

export default () => {
  const getVersions = async (): Promise<IBibleVersion[]> => {
    const query = new URLSearchParams({
      language: "eng",
      ids: "a81b73293d3080c9-01,78a9f6124f344018-01,63097d2a0a2f7db3-01,6f11a7de016f942e-01,d6e14a625393b4da-01,a761ca71e0b3ddcf-01", // AMP, NIV, NKJV, MSG, NLT, NASB
      "include-full-details": "false",
    });

    const response = await fetch(`${url}/bibles?${query.toString()}`, {
      headers,
    });

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }

    throw Error(response.statusText);
  };

  const getBooks = async (bibleId: string): Promise<IBibleBook[]> => {
    const response = await fetch(`${url}/bibles/${bibleId}/books`, { headers });

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }

    throw Error(response.statusText);
  };

  const getChapters = async (
    bibleId: string,
    bookId: string
  ): Promise<IBibleChapter[]> => {
    const response = await fetch(
      `${url}/bibles/${bibleId}/books/${bookId}/chapters`,
      { headers }
    );

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }

    throw Error(response.statusText);
  };

  const getVerses = async (
    bibleId: string,
    chapterId: string
  ): Promise<IBibleVerse[]> => {
    const response = await fetch(
      `${url}/bibles/${bibleId}/chapters/${chapterId}/verses`,
      { headers }
    );

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }

    throw Error(response.statusText);
  };

  const getContent = async (
    bibleId: string,
    verseId: string
  ): Promise<IBibleVerseContent> => {
    const query = new URLSearchParams({
      "content-type": "html",
      "include-notes": "false",
      "include-titles": "true",
      "include-chapter-numbers": "false",
      "include-verse-numbers": "true",
      "include-verse-spans": "true",
      "use-org-id": "false",
    });

    const response = await fetch(
      `${url}/bibles/${bibleId}/verses/${verseId}?${query.toString()}`,
      {
        headers,
      }
    );

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }

    throw Error(response.statusText);
  };

  return { getVersions, getBooks, getChapters, getVerses, getContent };
};
