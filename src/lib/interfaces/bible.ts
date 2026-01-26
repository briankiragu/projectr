export type ILanguage = {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: string;
};

export type ICountry = {
  id: string;
  name: string;
  nameLocal: string;
};

export type IAudioBible = {
  id: string;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
};

export type IBibleVersion = {
  id: string;
  dblId: string;
  relatedDbl: string | null;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  description: string | null;
  descriptionLocal: string | null;
  type: string;
  language: ILanguage;
  countries: ICountry[];
  audioBibles: IAudioBible[];
  updatedAt: string;
};

export type IBibleBook = {
  id: string;
  bibleId: string;
  name: string;
  nameLong: string;
  abbreviation: string;
};

export type IBibleChapter = {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  reference: string;
};

export type IBibleVerse = {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
};

export type VerseNavigation = {
  id: string;
  number: string;
};

export type IBibleVerseContent = {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  content: string;
  verseCount: number;
  previous: VerseNavigation;
  next: VerseNavigation;
  copyright: string;
};
