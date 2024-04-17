import EditQueueItemForm from "@components/forms/EditQueueItemForm";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<EditQueueItemForm />", () => {
  // Define the component props.
  const title = "ThiS iS-THE-tiTLe";
  const line = "This is a sample line";
  const item: IQueueItem = {
    qid: Date.now(),
    title,
    content: [[line], [line]],
  };
  const fn = vi.fn();

  // Define the user for events.
  const user = userEvent.setup();

  // Cleanup the vDOM after each test.
  afterEach(() => cleanup());

  test("it renders correctly", () => {
    // Render the component on the vDOM.
    render(() => <EditQueueItemForm item={item} handler={fn} />);

    // Get the elements from the vDOM.
    const headingEl = screen.getByRole("heading");
    const inputEl = screen.getByRole("textbox");

    // Make the assertions.
    expect(headingEl).toHaveTextContent("Make live changes");
    expect(inputEl).toHaveTextContent(line);
  });

  test("it calls the handler when the form is submitted", async () => {
    // Render the component on the vDOM.
    render(() => <EditQueueItemForm item={item} handler={fn} />);

    // Get the elements from the vDOM.
    const el = screen.getByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(fn).toHaveBeenCalledOnce();
  });

  test("it calls the handler with the correct data if edits are made", async () => {
    // Render the component on the vDOM.
    render(() => <EditQueueItemForm item={item} handler={fn} />);

    // Get the elements from the vDOM.
    const inputEl = screen.getByRole("textbox");
    const buttonEl = screen.getByRole("button");

    // Interact with the vDOM.
    await user.click(inputEl);
    await user.keyboard(line);
    await user.click(buttonEl);

    // Make the assertions.
    expect(fn.mock.calls[0][0].content.length).toBe(3);
  });
});
