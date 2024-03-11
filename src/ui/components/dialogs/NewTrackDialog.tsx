import { Component } from "solid-js"

const NewTrackDialog: Component<{
  uid: string
  ref: HTMLDialogElement
  handler: (title: string, lyrics: string) => Promise<void>
}> = (props) => {
  // Get the refs to the DOM elements.
  let formEl: HTMLFormElement
  let titleEl: HTMLInputElement
  let lyricsEl: HTMLTextAreaElement

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    // Get the value of the title and lyrics.
    const title = titleEl.value
    const lyrics = lyricsEl.value

    // Call the handler
    await props.handler(title, lyrics)

    // Reset the form.
    formEl.reset()

    // Close the dialog.
    formEl.closest('dialog')!.close('close')
  }

  return (
    <dialog ref={props.ref} id={props.uid} class="w-full md:w-[70%] rounded-lg" modal-mode="mega">
      <form ref={formEl!} method="dialog" onSubmit={handleSubmit}>
        <header class="bg-gray-200 py-2 px-4 flex justify-between items-center xl:px-8 xl:py-5">
          <h3 class="text-lg font-extrabold text-gray-900 xl:text-3xl">Add a new track</h3>
          <button class="material-symbols-outlined hover:bg-gray-500 rounded-full transition hover:text-gray-50 p-1" onClick={() => formEl.closest('dialog')!.close('close')}>
            close
          </button>
        </header>

        <article class="flex flex-col gap-4 px-4 py-2.5">
          <label for="title" class="text-sm text-gray-700">
            Title<sup class="text-red-500">*</sup>
            <input
              ref={titleEl!}
              id="title"
              name="title"
              type="text"
              class="w-full mt-0.5 border-2 bg-gray-100 rounded-md px-4 py-2.5 focus:outline-none"
              placeholder="Song title, eg. God is a good"
              required
            />
          </label>

          <label for="lyrics" class="text-sm text-gray-500">
            Lyrics<sup class="text-red-500">*</sup>
            <textarea
              ref={lyricsEl!}
              id="lyrics"
              rows="20"
              class="w-full mt-0.5 border-2 bg-gray-100 rounded-md px-4 py-2.5 focus:outline-none"
              placeholder="Song lyrics (separated by two new lines for each verse)"
              required
            ></textarea>
          </label>
        </article>

        <footer class="bg-gray-300">
          <menu class="flex justify-end items-center gap-4 px-5 py-3 font-semibold">
            <button
              autofocus
              type="reset"
              class="bg-rose-500 rounded-md px-5 py-1.5 text-rose-50 transition hover:bg-rose-800"
              onClick={() => formEl.closest('dialog')!.close('cancel')}
            >
              Cancel
            </button>
            <button
              type="submit"
              value="confirm"
              class="bg-tvc-green rounded-md px-5 py-1.5 text-green-50"
            >
              Confirm
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  )
}

export default NewTrackDialog
