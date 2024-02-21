export default () => {
  const toEditable = (lyrics?: string[][]): string =>
    lyrics
      ? lyrics.reduce((acc1, verse) => {
          const stanza = verse.reduce((acc2, line) => `${acc2}\n${line}`);

          return `${acc1}${stanza}\n\n`;
        }, ``)
      : ``;

  const fromEditable = (string: string): string[][] =>
    string
      .split(/\n\n/g)
      .filter((verse) => verse.length)
      .map((verse) => verse.split(/\n/g));

  return { toEditable, fromEditable };
};
