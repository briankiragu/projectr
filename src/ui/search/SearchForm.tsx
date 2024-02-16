// Import the modules.
import { Component, Ref, onMount } from 'solid-js';
import { debounceTime, distinctUntilChanged, fromEvent, switchMap } from 'rxjs';

// Import the interfaces.
import type { ITrack } from '../../interfaces/track';

// Import the composables.
import useMeiliSearch from '../../lib/composables/useMeiliSearch';

const SearchForm: Component<{ handler: (results: ITrack[]) => void }> = (
  props
) => {
  // Import the composables.
  const { search } = useMeiliSearch();

  // DOM reference.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inputRef: Ref<HTMLInputElement | undefined>;

  // Observable from DOM ref that watches user input.
  onMount(() => {
    fromEvent<InputEvent>(inputRef, 'input')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(async (event: InputEvent) => {
          const { hits } = await search(
            (event.target as HTMLInputElement).value
          );
          return hits as ITrack[];
        })
      )
      .subscribe((hits) => props.handler(hits));
  });

  return (
    <form>
      <label for="search">
        <span class="text-sm italic text-gray-800">
          Search for a song by title or lyrics...
        </span>
        <input
          ref={inputRef}
          id="search"
          type="search"
          name="search"
          class="mt-1 w-full rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none"
          placeholder="Search for a song by title or lyrics..."
          autofocus
        />
      </label>
    </form>
  );
};

export default SearchForm;
