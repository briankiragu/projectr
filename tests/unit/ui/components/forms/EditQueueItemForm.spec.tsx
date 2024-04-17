import EditQueueItemForm from "@components/forms/EditQueueItemForm";
import type { IQueueItem } from "@interfaces/queue";
import { cleanup, render, screen } from "@solidjs/testing-library";
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
});
