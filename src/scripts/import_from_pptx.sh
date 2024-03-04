#!/bin/bash

# Check if python-pptx is installed
# if ! python -c "import pptx" &> /dev/null; then
#     echo "Error: python-pptx library is not installed. Please install it using 'pip install python-pptx'."
#     exit 1
# fi

# Check if a PowerPoint file is provided as an argument
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <input_pptx_file>"
#     exit 1
# fi

python3 << END_PYTHON
import json
import logging
import os
import re
import structlog
import sys

from pptx import Presentation

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


def extract_text_from_pptx(input_pptx):
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


try:
    # Get all the .PPTX files supplied in the CLI.
    file_paths = "$@".split()
    log.debug(f"File paths provided.", file_paths=file_paths)

    # Set the name of the output file.
    __dirname = os.path.dirname(os.path.realpath(__file__))
    output_json = f"{__dirname}/src/scripts/data/lyrics.extracted.json"
    log.info(f"Attempting to extract data to {output_json}...")

    # Create a variable to hold all the data.
    extracted_data = []

    # Get all the extracted data from the files in one dataset.
    for file_path in file_paths:
        extracted_data += extract_text_from_pptx(file_path)
        log.debug(f"Extracted data from pptx file.", total_records=len(extracted_data))

    with open(output_json, "w", encoding="utf8") as json_file:
        json.dump(extracted_data, json_file)
    log.info(f"Data extracted successfully and saved to {output_json}")
except Exception as e:
    log.exception("Failed to extract data from .pptx files")
END_PYTHON

# python3 import_from_pptx.py $output_json
