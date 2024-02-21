"""Script to get track lyrics as json data from .PPTX"""

import json
import re


def format_extracted_text(slides: list[list[str]]) -> list[dict[str, str | list[str]]]:
    """Format the extracted data to the expected format"""

    tracks: list[dict[str, str | list[str]]] = []
    for slide in slides:
        current_track: dict[str, str | list[str]] = {"title": "", "lyrics": []}

        filtered_slide = [
            re.split(r"[\u000b\n]", item.replace("\u2019", "'"))
            for item in slide
            if item.strip()
        ]
        # tracks.append(filtered_slide)

        if len(filtered_slide) > 1:
            tracks.append(current_track)

            current_track["title"] = filtered_slide[0][0]
            current_track["lyrics"] = [filtered_slide[1]]  # type: ignore
        else:
            current_track["lyrics"].append(filtered_slide[0])  # type: ignore

    return tracks


try:
    # input_json: str = sys.argv[0]
    input_json: str = (
        "/Users/charis/Source/projectr/projectr-app/src/data/lyrics.extracted.json"
    )
    output_json: str = (
        "/Users/charis/Source/projectr/projectr-app/src/data/lyrics.formatted.json"
    )

    # Read the input file.
    with open(input_json, "r", encoding="utf8") as json_file:
        data: list[list[str]] = json.load(json_file)

    # Format the data.
    formatted_data: list[dict[str, str | list[str]]] = format_extracted_text(data)

    # Write the output file.
    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(formatted_data, json_file)

    print("Data formatted successfully and saved to", output_json)
except Exception as e:
    print("Error:", str(e))
