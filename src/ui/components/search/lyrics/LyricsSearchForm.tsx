// Import the modules.
import { debounceTime, distinctUntilChanged, fromEvent, switchMap } from "rxjs";
import { onMount, type Component } from "solid-js";

// Import the interfaces...
import type { ISearchItem } from "@interfaces/lyric";

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
    <form class="animate-slide-in" onSubmit={(e) => e.preventDefault()}>
      <label for="search">
        <input
          ref={inputRef!}
          id="search"
          type="search"
          name="search"
          class="w-full rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none dark:bg-gray-800 dark:text-gray-50"
          placeholder="Search for a track by title or content..."
          autofocus
        />
      </label>
    </form>
  );
};

export default LyricsSearchForm;
