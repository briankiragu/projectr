"""Script to get track lyrics as json data from .PPTX"""

import json
import logging
import os
import re
import structlog
import sys
import uuid

from pptx import Presentation
from typing import Set


# Create an instance of the logger.
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.DEBUG),
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer(),
    ]
)
log = structlog.get_logger()


def extract_data_from_pptx(input_pptx):
    log.info("Attempting to extract data from .pptx", file=input_pptx)
    prs = Presentation(input_pptx)
    data = []

    for slide in prs.slides:
        slide_data = [
            shape.text.strip()
            for shape in slide.shapes
            if shape.has_text_frame and shape.text.strip()
        ]
        data.append(slide_data)

    return data


def format_extracted_lyrics(
    slides: list[list[str]]
) -> list[dict[str, int | str | list[str]]]:
    """Format the extracted data to the expected format"""

    tracks: list[dict[str, int | str | list[str]]] = []
    current_title: str = ""
    current_lyrics: list[str] = []

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
            current_lyrics = [  # type: ignore
                extract_lyrics_from_string(*slide[1:])  # type: ignore
            ]
        elif len(slide) == 1:
            current_lyrics.append(  # type: ignore
                extract_lyrics_from_string(*slide)  # type: ignore
            )

    return tracks


def extract_title_from_string(title: str) -> str:
    """Remove formatting from titles"""

    return re.sub(
        r"[\u000b\n]", " ", title.replace("\u2019", "'").replace("\u2013", "-")
    )


def extract_lyrics_from_string(verse: str) -> list[str]:
    """From a single string, extract each lyric as an item in an array."""

    return re.split(r"[\u000b\n]", verse.replace("\u2019", "'"))


try:
    # Get all the .PPTX files supplied in the CLI.
    # file_paths = "$@".split()
    file_paths = sys.argv[1:]
    log.debug(f"File paths provided.", file_paths=file_paths)

    # Set the name of the output file.
    output_json = "./data/json/lyrics.extracted.json"
    log.info(f"Attempting to extract data...", output=output_json)

    # Create a variable to hold all the data.
    extracted_data = []

    # Get all the extracted data from the files in one dataset.
    for file_path in file_paths:
        extracted_data += extract_data_from_pptx(file_path)
        log.debug(
            f"Extracted data from pptx file.",
            total_records=len(extracted_data)
        )

    # Write the extracted data to the file.
    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(extracted_data, json_file)
    log.info(f"Data extracted successfully and saved.", output=output_json)

    # Format the data as JSON.
    formatted_json_data: list[
        dict[str, int | str | list[str]]
    ] = format_extracted_lyrics(extracted_data)

    # Set the name of the output file.
    output_json = "./data/json/lyrics.formatted.json"
    log.info(f"Attempting to format data...", output=output_json)

    # Write the json output file.
    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(formatted_json_data, json_file)
    log.info("JSON lyric data formatted successfully and saved.", output=output_json)
except Exception as e:
    print("Error:", str(e))