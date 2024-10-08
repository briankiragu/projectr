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
  const { loadVersions, loadBooks, loadChapters, loadVerses, loadContent } =
    useScriptures();

  // Create the signals.
  const [versionId, setVersionId] = createSignal<string>();
  const [bookId, setBookId] = createSignal<string>();
  const [chapterId, setChapterId] = createSignal<string>();
  const [verseIds, setVerseIds] = createSignal<string[]>();

  // Create the resources
  const [versions] = createResource(loadVersions);
  const [books, { mutate: mutateBooks }] = createResource(versionId, loadBooks);
  const [chapters, { mutate: mutateChapters }] = createResource(
    bookId,
    (bookId) => loadChapters(versionId()!, bookId)
  );
  const [verses, { mutate: mutateVerses }] = createResource(
    chapterId,
    (chapterId) => loadVerses(versionId()!, chapterId)
  );
  const [content, { mutate: mutateContent }] = createResource(
    verseIds,
    (verseIds) => loadContent(versionId()!, verseIds)
  );

  // Create the derived signals.
  const hasContent = () =>
    !content.loading && content() !== undefined && content()!.length > 0;

  const handleChangeVersion = (versionId: string) => {
    setVersionId(versionId);
    setBookId(undefined);
    setChapterId(undefined);
    setVerseIds(undefined);

    mutateBooks(undefined);
    mutateChapters(undefined);
    mutateVerses(undefined);
    mutateContent(undefined);
  };

  const handleChangeBook = (bookId: string) => {
    setBookId(bookId);
    setChapterId(undefined);
    setVerseIds(undefined);

    mutateChapters(undefined);
    mutateVerses(undefined);
    mutateContent(undefined);
  };

  const handleChangeChapter = (chapterId: string) => {
    setChapterId(chapterId);
    setVerseIds(undefined);

    mutateVerses(undefined);
    mutateContent(undefined);
  };

  const handleChangeVerse = (verseId: string) => {
    let ids: string[] | undefined = [];

    // If the verse is already selected, remove it.
    if (verseIds()?.includes(verseId)) {
      ids = verseIds()?.filter((id) => id !== verseId);
    } else {
      ids = [...(verseIds() || []), verseId];
    }

    // Sort the verses
    ids?.sort((a, b) => {
      const newA = a.match(/\d+$/g)?.at(0);
      const newB = b.match(/\d+$/g)?.at(0);

      if (newA && newB) {
        if (parseInt(newA, 10) < parseInt(newB, 10)) return -1;
        if (parseInt(newA, 10) > parseInt(newB, 10)) return 1;
      }

      return 0;
    });

    setVerseIds(ids);
    mutateContent(undefined);
  };

  const handleSubmit = (e: Event) => {
    // Stop form submission.
    e.preventDefault();

    props.enqueueHandler({
      qid: Date.now(),
      title: `${verseIds()?.at(0)} to ${verseIds()?.at(-1)}`,
      content: content()!.map((verse) => [verse.content]),
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
          class="w-full rounded-md p-3 text-sm text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400"
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
        <span class="col-span-full hidden text-sm italic text-gray-800">
          Book
        </span>
        <select
          id="book"
          class="w-full rounded-md p-3 text-sm text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400"
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
        <span class="col-span-full hidden text-sm italic text-gray-800">
          Chapter
        </span>
        <select
          id="chapter"
          class="w-full rounded-md p-3 text-sm capitalize text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400"
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

      {/* Verse */}
      <div class="col-span-full grid h-[8.5rem] grid-cols-4 gap-3 overflow-y-scroll">
        <Show when={verses.loading}>
          <span class="text-sm">Loading...</span>
        </Show>
        <For each={verses()}>
          {(verse) => (
            <button
              type="button"
              id={`verse-${verse.id}`}
              title={verse.reference}
              class="col-span-1 flex min-h-8 cursor-pointer items-center justify-center gap-0.5 overflow-hidden text-ellipsis rounded-md border-2 border-gray-400 bg-gray-400 text-center text-sm text-gray-50 dark:bg-gray-700"
              classList={{
                "border-gray-700 dark:border-gray-50": verseIds()?.includes(
                  verse.id
                ),
              }}
              onClick={() => handleChangeVerse(verse.id)}
            >
              {verse.orgId}
            </button>
          )}
        </For>
      </div>

      <button
        type="submit"
        class="col-span-full flex items-center justify-center gap-2 rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-gray-50 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        disabled={!hasContent()}
      >
        <span class="material-symbols-outlined">add_to_queue</span>
        Add to queue
      </button>
    </form>
  );
};

export default ScripturesSearchForm;
