export type IBibleVersion = {
  id: string;
  dblId: string;
  relatedDbl: null;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  description: string;
  descriptionLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
  countries: [
    {
      id: string;
      name: string;
      nameLocal: string;
    },
  ];
  type: string;
  updatedAt: string;
  audioBibles: [];
};

export type IBibleBook = {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
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
  bookId: string;
  chapterId: string;
  bibleId: string;
  reference: string;
};

export type IBibleVerseContent = {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  bibleId: string;
  reference: string;
  content: string;
  verseCount: number;
  copyright: string;
  next: {
    id: string;
    number: string;
  };
  previous: {
    id: string;
    number: string;
  };
};
