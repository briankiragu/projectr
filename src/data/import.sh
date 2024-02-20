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
output_json="${input_pptx%.*}.json"

# Python script to extract data from pptx and convert it to JSON
python << END_PYTHON
import json
from pptx import Presentation

def extract_text_from_pptx(input_pptx):
    prs = Presentation(input_pptx)
    data = []
    for slide in prs.slides:
        slide_data = []
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                slide_data.append(shape.text)
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
