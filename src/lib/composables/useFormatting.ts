export default () => {
  const toEditableLyrics = (content: string[][]): string =>
    content.reduce((acc1, verse) => {
      const stanza = verse.reduce((acc2, line) => `${acc2}\n${line}`);
      return `${acc1}${stanza}\n\n`;
    }, ``);

  const fromEditableLyrics = (content: string): string[][] =>
    content
      .split(/\n\n/g)
      .filter((verse) => verse.length)
      .map((verse) => verse.split(/\n/g));

  const toTitleCase = (phrase?: string) =>
    phrase
      ? phrase
          .toLowerCase()
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : null;

  return {
    toEditableLyrics,
    fromEditableLyrics,
    toTitleCase,
  };
};
