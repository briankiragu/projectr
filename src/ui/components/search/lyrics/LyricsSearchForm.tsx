// Import the modules.
import { debounceTime, distinctUntilChanged, fromEvent, switchMap } from "rxjs";
import { onMount, type Component } from "solid-js";

// Import the interfaces...
import type { ISearchItem } from "@interfaces/track";

// Import the composables...
import useTracks from "@composables/useTracks";

const LyricsSearchForm: Component<{
  searchHandler: (results: ISearchItem[]) => void;
}> = (props) => {
  // Import the composables.
  const { searchTracks } = useTracks();

  // DOM reference.
  let inputRef: HTMLInputElement;

  // Observable from DOM ref that watches user input.
  onMount(() => {
    fromEvent<InputEvent>(inputRef!, "input")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(async (event: InputEvent) => {
          const phrase: string = (event.target as HTMLInputElement).value;
          return searchTracks(phrase);
        })
      )
      .subscribe((hits) => props.searchHandler(hits));
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label for="search">
        <span class="text-sm font-semibold italic text-gray-800">
          Search for a track by title or lyrics...
        </span>
        <input
          ref={inputRef!}
          id="search"
          type="search"
          name="search"
          class="w-full rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none"
          placeholder="Search for a track by title or lyrics..."
          autofocus
        />
      </label>
    </form>
  );
};

export default LyricsSearchForm;
