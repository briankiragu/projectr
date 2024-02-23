"""Script to get track lyrics as json data from .PPTX"""

import json
import re
import uuid
import sys


def extract_title_from_string(title: str) -> str:
    """Remove formatting from titles"""
    return re.sub(
        r"[\u000b\n]", " ", title.replace("\u2019", "'").replace("\u2013", "-")
    )


def extract_lyrics_from_string(verse: str) -> list[str]:
    """From a single string, extract each lyric as an item in an array."""

    return re.split(r"[\u000b\n]", verse.replace("\u2019", "'"))


def format_extracted_lyrics_as_json(
    slides: list[list[str]],
) -> list[dict[str, int | str | list[str]]]:
    """Format the extracted data to the expected format"""

    tracks: list[dict[str, int | str | list[str]]] = []
    current_title: str = ""
    current_lyrics: list[str] = []

    for slide in slides:
        if len(slide) >= 2:
            tracks.append(
                {
                    "id": len(tracks) + 461,
                    "title": current_title,
                    "lyrics": current_lyrics,
                }
            )

            current_title = extract_title_from_string(slide[0])
            current_lyrics = [  # type: ignore
                extract_lyrics_from_string(*slide[1:])  # type: ignore
            ]
        elif len(slide) == 1:
            current_lyrics.append(  # type: ignore
                extract_lyrics_from_string(*slide)  # type: ignore
            )

    return tracks


def format_extracted_lyrics_as_text(
    slides: list[list[str]],
) -> list[dict[str, int | str]]:
    """Format the extracted data to the expected format"""

    tracks: list[dict[str, int | str]] = []
    current_title: str = ""
    current_lyrics: str = ""

    for slide in slides:
        if len(slide) >= 2:
            tracks.append(
                {
                    "id": len(tracks) + 1,
                    "title": current_title,
                    "lyrics": current_lyrics,
                }
            )

            current_title = extract_title_from_string(slide[0])
            current_lyrics = "\n\n".join(slide[1:]).replace("\u2019", "'")
        elif len(slide) == 1:
            current_lyrics += f"\n\n{slide[0]}".replace("\u2019", "'")

    return tracks


try:
    input_json = sys.argv[1]
    output_json = "lyrics.formatted_as_json.json"
    output_text = "lyrics.formatted_as_text.json"

    # Read the input file.
    with open(input_json, "r", encoding="utf8") as json_file:
        data: list[list[str]] = json.load(json_file)

    # Format the data.
    formatted_json_data: list[
        dict[str, int | str | list[str]]
    ] = format_extracted_lyrics_as_json(data)
    formatted_text_data: list[dict[str, int | str]] = format_extracted_lyrics_as_text(
        data
    )

    # Write the json output file.
    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(formatted_json_data, json_file)
    print("JSON lyric data formatted successfully and saved to", output_json)

    # Write the text output file.
    with open(output_text, "w", encoding="utf8") as json_file:
        json.dump(formatted_text_data, json_file)
    print("Text lyric data formatted successfully and saved to", output_text)

except Exception as e:
    print("Error:", str(e))
