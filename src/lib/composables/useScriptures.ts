// Import the interfaces...
import type {
  IBibleBook,
  IBibleChapter,
  IBibleVerse,
  IBibleVerseContent,
  IBibleVersion,
} from "../interfaces/bible";

// Import the composables...
import useBibleAPI from "@composables/apis/useBibleAPI";

export default () => {
  const { getVersions, getBooks, getChapters, getVerses, getContent } =
    useBibleAPI();

  const loadVersions = async (): Promise<IBibleVersion[]> => {
    const versions = await getVersions();
    return versions.data;
  };

  const loadBooks = async (versionId: string): Promise<IBibleBook[]> => {
    const books = await getBooks(versionId);
    return books.data;
  };

  const loadChapters = async (
    versionId: string,
    bookId: string
  ): Promise<IBibleChapter[]> => {
    const response = await getChapters(versionId, bookId);
    return response.data;
  };

  const loadVerses = async (
    versionId: string,
    chapterId: string
  ): Promise<IBibleVerse[]> => {
    const response = await getVerses(versionId, chapterId);
    return response.data;
  };

  const loadContent = async (
    versionId: string,
    verseIds: string[]
  ): Promise<IBibleVerseContent[]> => {
    const contentPromises = verseIds.map(async (verseId) => {
      const response = await getContent(versionId, verseId);
      return response.data as IBibleVerseContent;
    });
    return Promise.all(contentPromises);
  };

  const loadChapterContent = async (
    versionId: string,
    chapterId: string
  ): Promise<IBibleVerseContent[]> => {
    // First load all verses for the chapter
    const verses = await loadVerses(versionId, chapterId);
    // Then load content for each verse
    const verseIds = verses.map((verse) => verse.id);
    return loadContent(versionId, verseIds);
  };

  return {
    loadVersions,
    loadBooks,
    loadChapters,
    loadVerses,
    loadContent,
    loadChapterContent,
  };
};
