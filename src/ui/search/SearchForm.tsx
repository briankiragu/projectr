// Import the modules.
import { Component, Ref, onMount } from 'solid-js';
import { fromEvent, switchMap } from 'rxjs';

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
        switchMap(
          (event: InputEvent) => (event.target as HTMLInputElement).value
        )
      )
      .subscribe(async (phrase) => {
        const { hits } = await search(phrase);

        // Add the results to the state.
        props.handler(hits as ITrack[]);
      });
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
