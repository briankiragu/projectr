import { describe, expect, test, vi, beforeEach } from "vitest";
import useScriptures from "@composables/useScriptures";
import type {
  IBibleBook,
  IBibleChapter,
  IBibleVerse,
  IBibleVerseContent,
  IBibleVersion,
} from "@interfaces/bible";

// Mock data
const mockVersions: IBibleVersion[] = [
  {
    id: "version-1",
    dblId: "dbl-1",
    relatedDbl: null,
    name: "Test Version",
    nameLocal: "Test Version Local",
    abbreviation: "TV",
    abbreviationLocal: "TV",
    description: null,
    descriptionLocal: null,
    type: "text",
    language: {
      id: "eng",
      name: "English",
      nameLocal: "English",
      script: "Latin",
      scriptDirection: "ltr",
    },
    countries: [],
    audioBibles: [],
    updatedAt: "2024-01-01",
  },
];

const mockBooks: IBibleBook[] = [
  {
    id: "GEN",
    bibleId: "version-1",
    name: "Genesis",
    nameLong: "The Book of Genesis",
    abbreviation: "Gen",
  },
];

const mockChapters: IBibleChapter[] = [
  {
    id: "GEN.1",
    bibleId: "version-1",
    bookId: "GEN",
    number: "1",
    reference: "Genesis 1",
  },
];

const mockVerses: IBibleVerse[] = [
  {
    id: "GEN.1.1",
    orgId: "org-1",
    bibleId: "version-1",
    bookId: "GEN",
    chapterId: "GEN.1",
    reference: "Genesis 1:1",
  },
  {
    id: "GEN.1.2",
    orgId: "org-2",
    bibleId: "version-1",
    bookId: "GEN",
    chapterId: "GEN.1",
    reference: "Genesis 1:2",
  },
];

const mockContent: IBibleVerseContent = {
  id: "GEN.1.1",
  orgId: "org-1",
  bibleId: "version-1",
  bookId: "GEN",
  chapterId: "GEN.1",
  reference: "Genesis 1:1",
  content: "In the beginning...",
  verseCount: 1,
  previous: { id: "", number: "" },
  next: { id: "GEN.1.2", number: "2" },
  copyright: "Test copyright",
};

// Mock the useBibleAPI composable
vi.mock("@composables/apis/useBibleAPI", () => ({
  default: () => ({
    getVersions: vi.fn().mockResolvedValue(mockVersions),
    getBooks: vi.fn().mockResolvedValue(mockBooks),
    getChapters: vi.fn().mockResolvedValue(mockChapters),
    getVerses: vi.fn().mockResolvedValue(mockVerses),
    getContent: vi.fn().mockResolvedValue(mockContent),
  }),
}));

describe("useScriptures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("it loads versions", async () => {
    const { loadVersions } = useScriptures();

    const versions = await loadVersions();

    expect(versions).toEqual(mockVersions);
    expect(versions).toHaveLength(1);
    expect(versions[0].name).toBe("Test Version");
  });

  test("it loads books for a version", async () => {
    const { loadBooks } = useScriptures();

    const books = await loadBooks("version-1");

    expect(books).toEqual(mockBooks);
    expect(books).toHaveLength(1);
    expect(books[0].name).toBe("Genesis");
  });

  test("it loads chapters for a book", async () => {
    const { loadChapters } = useScriptures();

    const chapters = await loadChapters("version-1", "GEN");

    expect(chapters).toEqual(mockChapters);
    expect(chapters).toHaveLength(1);
    expect(chapters[0].number).toBe("1");
  });

  test("it loads verses for a chapter", async () => {
    const { loadVerses } = useScriptures();

    const verses = await loadVerses("version-1", "GEN.1");

    expect(verses).toEqual(mockVerses);
    expect(verses).toHaveLength(2);
  });

  test("it loads content for verse IDs", async () => {
    const { loadContent } = useScriptures();

    const contents = await loadContent("version-1", ["GEN.1.1", "GEN.1.2"]);

    expect(contents).toHaveLength(2);
    expect(contents[0].content).toBe("In the beginning...");
  });

  test("it loads entire chapter content", async () => {
    const { loadChapterContent } = useScriptures();

    const contents = await loadChapterContent("version-1", "GEN.1");

    expect(contents).toHaveLength(2);
  });
});
