#!/bin/bash

# Check if python-pptx is installed
if ! python -c "import pptx" &> /dev/null; then
    echo "Error: python-pptx library is not installed. Please install it using 'pip install python-pptx'."
    exit 1
fi

# Check if a PowerPoint file is provided as an argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <input_pptx_file>"
    exit 1
fi

input_pptx="$1"
output_json="${input_pptx%.*}.extracted.json"

python << END_PYTHON
import json
import re

from pptx import Presentation

def extract_text_from_pptx(input_pptx):
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


input_pptx = "$input_pptx"
output_json = "$output_json"

try:
    extracted_data = extract_text_from_pptx(input_pptx)

    with open(output_json, "w") as json_file:
        json.dump(extracted_data, json_file)
    print("Data extracted successfully and saved to", output_json)
except Exception as e:
    print("Error:", str(e))
END_PYTHON

python import.py $output_json
