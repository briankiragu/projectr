// Import the modules.
import {
  Show,
  For,
  createResource,
  createSignal,
  type Component,
} from "solid-js";

// Import the interfaces...
import type { IQueueItem } from "@interfaces/queue";

// Import the composables.
import useScriptures from "@composables/useScriptures";

const ScripturesSearchForm: Component<{
  enqueueHandler: (item: IQueueItem) => void;
}> = (props) => {
  // Import the composables.
  const { loadVersions, loadBooks, loadChapters, loadChapterContent } =
    useScriptures();

  // Create the signals.
  const [versionId, setVersionId] = createSignal<string>();
  const [bookId, setBookId] = createSignal<string>();
  const [chapterId, setChapterId] = createSignal<string>();

  // Create the resources
  const [versions] = createResource(loadVersions);
  const [books, { mutate: mutateBooks }] = createResource(versionId, loadBooks);
  const [chapters, { mutate: mutateChapters }] = createResource(
    bookId,
    (bookId) => loadChapters(versionId()!, bookId)
  );
  const [content, { mutate: mutateContent }] = createResource(
    chapterId,
    (chapterId) => loadChapterContent(versionId()!, chapterId)
  );

  // Create the derived signals.
  const hasContent = () =>
    !content.loading && content() !== undefined && content()!.length > 0;

  const handleChangeVersion = (versionId: string) => {
    setVersionId(versionId);
    setBookId(undefined);
    setChapterId(undefined);

    mutateBooks(undefined);
    mutateChapters(undefined);
    mutateContent(undefined);
  };

  const handleChangeBook = (bookId: string) => {
    setBookId(bookId);
    setChapterId(undefined);

    mutateChapters(undefined);
    mutateContent(undefined);
  };

  const handleChangeChapter = (chapterId: string) => {
    setChapterId(chapterId);
    mutateContent(undefined);
  };

  const handleSubmit = (e: Event) => {
    // Stop form submission.
    e.preventDefault();

    const verses = content()!;
    const firstVerse = verses.at(0)?.reference;
    const lastVerse = verses.at(-1)?.reference;
    const title =
      verses.length === 1 ? firstVerse : `${firstVerse} - ${lastVerse}`;

    props.enqueueHandler({
      qid: Date.now(),
      title: title ?? chapterId()!,
      content: verses.map((verse) => [verse.content]),
    });
  };

  return (
    <form
      class="animate-slide-in grid grid-cols-4 gap-2"
      onSubmit={handleSubmit}
    >
      {/* Version */}
      <label for="version" class="col-span-full">
        <select
          id="version"
          class="w-full rounded-md p-3 text-sm text-gray-700 focus:outline-hidden dark:bg-gray-800 dark:text-gray-400"
          onChange={(e) =>
            handleChangeVersion((e.target as HTMLSelectElement).value)
          }
          required
        >
          <Show
            when={versions.loading}
            fallback={
              <option selected disabled>
                Choose a version
              </option>
            }
          >
            <option selected>Loading...</option>
          </Show>
          <For each={versions()}>
            {(version) => (
              <option value={version.id}>
                {version.abbreviationLocal} - {version.nameLocal}
                {version.descriptionLocal
                  ? ` (${version.descriptionLocal})`
                  : null}
              </option>
            )}
          </For>
        </select>
      </label>

      {/* Book */}
      <label for="book" class="col-span-2">
        <span class="col-span-full hidden text-sm text-gray-800 italic">
          Book
        </span>
        <select
          id="book"
          class="w-full rounded-md p-3 text-sm text-gray-700 focus:outline-hidden dark:bg-gray-800 dark:text-gray-400"
          onChange={(e) =>
            handleChangeBook((e.target as HTMLSelectElement).value)
          }
          required
        >
          <Show
            when={books.loading}
            fallback={
              <option selected disabled>
                Choose a book
              </option>
            }
          >
            <option selected>Loading...</option>
          </Show>
          <For each={books()}>
            {(book) => <option value={book.id}>{book.name}</option>}
          </For>
        </select>
      </label>

      {/* Chapter */}
      <label for="chapter" class="col-span-2">
        <span class="col-span-full hidden text-sm text-gray-800 italic">
          Chapter
        </span>
        <select
          id="chapter"
          class="w-full rounded-md p-3 text-sm text-gray-700 capitalize focus:outline-hidden dark:bg-gray-800 dark:text-gray-400"
          onChange={(e) =>
            handleChangeChapter((e.target as HTMLSelectElement).value)
          }
          required
        >
          <Show
            when={chapters.loading}
            fallback={
              <option selected disabled>
                Choose a chapter
              </option>
            }
          >
            <option selected>Loading...</option>
          </Show>
          <For each={chapters()}>
            {(chapter) => <option value={chapter.id}>{chapter.number}</option>}
          </For>
        </select>
      </label>

      {/* Loading indicator */}
      <Show when={content.loading}>
        <div class="col-span-full flex items-center justify-center gap-2 py-4 text-sm text-gray-700">
          <span class="material-symbols-outlined animate-spin">autorenew</span>
          Loading verses...
        </div>
      </Show>

      {/* Verse count indicator */}
      <Show when={!content.loading && content() && content()!.length > 0}>
        <div class="col-span-full rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {content()!.length} verses loaded
        </div>
      </Show>

      <button
        type="submit"
        class="col-span-full flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-gray-50 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        disabled={!hasContent()}
      >
        <span class="material-symbols-outlined">add_to_queue</span>
        Add to queue
      </button>
    </form>
  );
};

export default ScripturesSearchForm;
