import { Component } from "solid-js"

const NewTrackDialog: Component<{
  uid: string
  ref: HTMLDialogElement | undefined
  handler: () => void
}> = (props) => {
  let closeEl: HTMLButtonElement | undefined

  return (
    <dialog id={props.uid} ref={props.ref} modal-mode="mega">
      <form method="dialog">
        <header>
          <h3>Add a New Track</h3>
          <button onClick={() => closeEl?.closest('dialog')?.close('close')}></button>
        </header>
        <article>...</article>
        <footer>
          <menu>
            <button autofocus type="reset" onClick={() => closeEl?.closest('dialog')?.close('cancel')}>Cancel</button>
            <button type="submit" value="confirm">Confirm</button>
          </menu>
        </footer>
      </form>
    </dialog>
  )
}

export default NewTrackDialog
