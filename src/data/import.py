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


def format_extracted_text(slides: list[list[str]]) -> list[dict[str, int | str | list[str]]]:
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
        # else:

    return tracks


try:
    input_json: str = (
        "/Users/charis/Source/projectr/projectr-app/src/data/tvc-lyrics.extracted.json"
    )
    output_json: str = (
        "/Users/charis/Source/projectr/projectr-app/src/data/tvc-lyrics.formatted.json"
    )

    # Read the input file.
    with open(input_json, "r", encoding="utf8") as json_file:
        data: list[list[str]] = json.load(json_file)

    # Format the data.
    formatted_data: list[dict[str, int | str | list[str]]] = format_extracted_text(data)

    # Write the output file.
    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(formatted_data, json_file)

    print("Data formatted successfully and saved to", output_json)
except Exception as e:
    print("Error:", str(e))
