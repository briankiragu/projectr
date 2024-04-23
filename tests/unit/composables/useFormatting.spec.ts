import { describe, expect, test } from "vitest";
import useFormatting from "@composables/useFormatting";

describe("useFormatting", () => {
  // Get the methods from the composable.
  const { fromEditableLyrics, toEditableLyrics, toTitleCase } = useFormatting();

  test("it converts a multi-dimensional array of lyrics into a string", () => {
    const lyrics = [
      ["Verse 1 Line 1", "Verse 1 Line 2"],
      ["Verse 2 Line 1", "Verse 2 Line 2"],
    ];
    const expected =
      "Verse 1 Line 1\nVerse 1 Line 2\n\nVerse 2 Line 1\nVerse 2 Line 2\n\n";

    // Make the assertions.
    expect(expected).toEqual(toEditableLyrics(lyrics));
  });

  test("it converts a string to a multi-dimensional array of lyrics", () => {
    const lyrics =
      "Verse 1 Line 1\nVerse 1 Line 2\n\nVerse 2 Line 1\nVerse 2 Line 2\n\n";
    const expected = [
      ["Verse 1 Line 1", "Verse 1 Line 2"],
      ["Verse 2 Line 1", "Verse 2 Line 2"],
    ];

    // Make the assertions.
    expect(expected).toEqual(fromEditableLyrics(lyrics));
  });

  test("it should convert a string to title case", () => {
    expect("Hello World").toEqual(toTitleCase("hello world"));
    expect("Foo Bar Baz").toEqual(toTitleCase("fOO bAr-baZ"));
  });

  test("it should return null if input is undefined", () => {
    expect(null).toEqual(toTitleCase(undefined));
  });
});
