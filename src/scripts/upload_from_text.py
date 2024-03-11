"""Whenever a new track that is not in the set-list is requested,
this script can be called to quickly add it to the search results."""

import json
import logging
import meilisearch
import os
import structlog
import sys

from time import time
from dotenv import load_dotenv
from pathlib import Path
from urllib.parse import quote

# Load the environment variables.
load_dotenv()

# Create an instance of the logger.
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer(),
    ]
)
log = structlog.get_logger()


def convert_text_to_lyrics(path_to_file: str) -> list[list[str]]:
    """Capture the lyrics from the text file and parse them as a list of lyrics"""

    try:
        log.info("Attempting to extract lyrics from text file...")
        with open(path_to_file, "r") as file:
            lyrics = file.read()
            return [
                list(filter(lambda line: len(line) > 0, verse.split("\n")))
                for verse in lyrics.split("\n\n")
            ]
    except Exception as e:
        log.exception("Failed to extract lyrics from text file.")
        raise(e)


def update_or_create_in_meilisearch(title: str, lyrics: list[list[str]]):
    """Add the lyrics and title to Meilisearch"""

    try:
        log.info("Attempting to add track to Meilisearch...", title=title)

        # Get the environment variables.
        VITE_MEILI_HOST = os.getenv("VITE_MEILI_HOST")
        VITE_MEILI_MASTER_KEY = os.getenv("VITE_MEILI_MASTER_KEY")

        # Raise an error if any of the environment variables is missing.
        if ((VITE_MEILI_HOST == None) or (VITE_MEILI_MASTER_KEY == None)):
            raise Exception("Environment variables not found!")

        # Instantiate the client and get the correct index.
        client = meilisearch.Client(VITE_MEILI_HOST, VITE_MEILI_MASTER_KEY)
        index = client.get_index("tracks")
        log.debug("Created instance of client and index.", index="tracks")

        # Find all matching document(s) by the title.
        response = index.get_documents({
          "fields": ["id","title", "lyrics"],
          "filter": f"title='{title}'"
        })
        log.debug(f"Found documents with matching title.", index="tracks", count=len(response.results))

        # If there are one or more matches, take the ID of the first document as our update_or_create.
        if len(response.results) > 0:
            log.info(f"Updating document with matching ID...", id=response.results[0].id)
            id = response.results[0].id
        else:
            id = round(time())

        # Construct the document.
        new_document = [{"id": id, "title": title, "lyrics": lyrics}]
        log.debug(f"Updating or creating new document...", new_document=new_document)

        # Upload the data to meilisearch.
        task = index.add_documents(new_document)
        log.debug(f"Added track to documents.", task=task)

        log.info(
            f"Successfully added track.",
            title=title,
            new_document=new_document[0]["id"],
            task_uid=task.task_uid
        )
    except Exception as e:
        log.exception("Failed to add track to Meilisearch with error.")
        raise(e)


if __name__ == "__main__":
    try:
        # Get the path to the file from the CLI.
        path_to_file:str = sys.argv[1]

        # Get the title of the track from the CLI.
        title:str = sys.argv[2]

        lyrics = convert_text_to_lyrics(path_to_file)

        if lyrics:
            update_or_create_in_meilisearch(title, lyrics)
    except Exception as e:
        log.exception("Failed to import track from text file.")
