import ProjectionButton from "@components/buttons/ProjectionButton";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("<ProjectionButton />", () => {
  // Define the mock data.
  const startIcon = "screen_share";
  const startText = "Launch projection";
  const stopIcon = "stop_screen_share";
  const title = "Shift + P";
  const startHandler = vi.fn();
  const stopHandler = vi.fn();

  // Setup the user for events.
  const user = userEvent.setup();

  test("it should render the start state correctly", () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={true}
        isProjecting={false}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the element from the vDOM.
    const [el] = screen.getAllByRole("button");

    // Make the assertions.
    expect(el).toContainHTML(
      `<span class="material-symbols-outlined transition">${startIcon}</span>`
    );
    expect(el).toHaveAccessibleName(`${startIcon} ${startText}`);
    expect(el).toHaveAttribute("title", title);
  });

  test("it should render the stop state correctly", () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={true}
        isProjecting={true}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the element from the vDOM.
    const [firstEl, secondEl] = screen.getAllByRole("button");

    // Make the assertions on the first button.
    expect(firstEl).toContainHTML(
      `<span class="material-symbols-outlined transition">${startIcon}</span>`
    );
    expect(firstEl).toHaveAccessibleName(`${startIcon} ${startText}`);
    expect(firstEl).toHaveAttribute("title", title);

    // Make the assertions on the second button.
    expect(secondEl).toContainHTML(
      `<span class="material-symbols-outlined transition">${stopIcon}</span>`
    );
    expect(secondEl).toHaveAccessibleName(`${stopIcon}`);
  });

  test("it should call the start handler if clicked when it is not projecting", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={true}
        isProjecting={false}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the element from the vDOM.
    const [el] = screen.getAllByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(startHandler).toHaveBeenCalledOnce();
  });

  test("it should call the start handler if clicked when it is projecting", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={true}
        isProjecting={true}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the element from the vDOM.
    const [el] = screen.getAllByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(startHandler).toHaveBeenCalledOnce();
  });

  test("it should call the stop handler if clicked when it is projecting", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={true}
        isProjecting={true}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the element from the vDOM.
    const [, el] = screen.getAllByRole("button");
    await user.click(el);

    // Make the assertions.
    expect(stopHandler).toHaveBeenCalledOnce();
  });
});
