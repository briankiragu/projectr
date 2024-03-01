import json
import meilisearch
import os
import sys

from time import time
from dotenv import load_dotenv
from pathlib import Path


# Load the environment variables.
load_dotenv()

def convert_text_to_lyrics(path_to_file: str) -> list[list[str]]:
    """Capture the lyrics from the text file and parse them as a list of lyrics"""

    try:
        with open(path_to_file, "r") as file:
            lyrics = file.read()
            return [
                list(filter(lambda line: len(line) > 0, verse.split("\n")))
                for verse in lyrics.split("\n\n")
            ]
    except Exception as e:
        raise(e)


def add_to_meilisearch(title:str, lyrics: list[list[str]]):
    """Add the lyrics and title to Meilisearch"""

    try:
        print("Attempting to add track to Meilisearch...")

        # Get the name of the index.
        index_name = "tracks"

        # Get the environment variables.
        VITE_MEILI_HOST = os.getenv('VITE_MEILI_HOST')
        VITE_MEILI_MASTER_KEY = os.getenv('VITE_MEILI_MASTER_KEY')

        # Raise an error if any of the environment variables is missing.
        if ((VITE_MEILI_HOST == None) or (VITE_MEILI_MASTER_KEY == None)):
            raise Exception("Environment variables not found!")

        # Instantiate the client and get the correct index.
        index = meilisearch.Client(VITE_MEILI_HOST, VITE_MEILI_MASTER_KEY).get_index(index_name)

        # Construct the new document.
        new_document = [
            {"id": round(time()), "title": title, "lyrics": lyrics}
        ]

        # Upload the data to meilisearch.
        task = index.add_documents(new_document)

        print(
            f"Successfully added track '{title}' with ID: '{new_document[0]['id']}' with task UID: '{task.task_uid}'."
        )
    except Exception as e:
       raise(e)


if __name__ == "__main__":
    # Get the path to the file from the CLI.
    path_to_file:str = sys.argv[1]

    # Get the title of the song from the CLI.
    title:str = sys.argv[2]

    lyrics = convert_text_to_lyrics(path_to_file)

    if lyrics:
        add_to_meilisearch(title, lyrics)
