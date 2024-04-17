import DisplayButton from "@components/buttons/DisplayButton";
import { cleanup, render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

// After each test, clean up the mounted vDOM.
afterEach(() => cleanup());

describe("<DisplayButton />", () => {
  // Define the mock data.
  const showIcon = "visibility";
  const showText = "Show lyrics";
  const hideIcon = "visibility_off";
  const hideText = "Hide lyrics";
  const title = "Shift + S";
  const showHandler = vi.fn();
  const hideHandler = vi.fn();

  // Setup the user for events.
  const user = userEvent.setup();

  test("it should render the show state correctly", () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={true}
        isDisplaying={true}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");

    // Make the assertions.
    expect(el).toContainHTML(
      `<span class="material-symbols-outlined transition">${hideIcon}</span>`
    );
    expect(el).toHaveAccessibleName(`${hideIcon} ${hideText}`);
    expect(el).toHaveAttribute("title", title);
  });

  test("it should render the hide state correctly", () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={true}
        isDisplaying={false}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");

    // Make the assertions.
    expect(el).toContainHTML(
      `<span class="material-symbols-outlined transition">${showIcon}</span>`
    );
    expect(el).toHaveAccessibleName(`${showIcon} ${showText}`);
    expect(el).toHaveAttribute("title", title);
  });

  test("it should be disabled if the property is set", () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={false}
        isDisplaying={false}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");

    // Make the assertions.
    expect(el).toBeDisabled();
  });

  test("it should call the show handler if clicked when it is not displaying", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={true}
        isDisplaying={false}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(showHandler).toHaveBeenCalledOnce();
  });

  test("it should call the hide handler if clicked when it is displaying", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={true}
        isDisplaying={true}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(hideHandler).toHaveBeenCalledOnce();
  });

  test("it should not be clickable while disabled", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <DisplayButton
        title={title}
        isEnabled={false}
        isDisplaying={false}
        showHandler={showHandler}
        hideHandler={hideHandler}
      />
    ));

    // Get the element from the vDOM.
    const el = screen.getByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(showHandler).not.toHaveBeenCalled();
  });
});
