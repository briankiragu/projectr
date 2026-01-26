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

  const loadVersions = async (): Promise<IBibleVersion[]> =>
    await getVersions();

  const loadBooks = async (versionId: string): Promise<IBibleBook[]> =>
    await getBooks(versionId);

  const loadChapters = async (
    versionId: string,
    bookId: string
  ): Promise<IBibleChapter[]> => await getChapters(versionId, bookId);

  const loadVerses = async (
    versionId: string,
    chapterId: string
  ): Promise<IBibleVerse[]> => await getVerses(versionId, chapterId);

  const loadContent = async (
    versionId: string,
    verseIds: string[]
  ): Promise<IBibleVerseContent[]> => {
    const contentPromises = verseIds.map(
      async (verseId) => await getContent(versionId, verseId)
    );

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
