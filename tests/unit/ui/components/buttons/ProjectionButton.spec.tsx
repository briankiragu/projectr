import ProjectionButton from "@components/buttons/ProjectionButton";
import { IProjectionScreenTypes } from "@interfaces/projection";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";

describe("<ProjectionButton />", () => {
  // Define the mock data.
  const startIcon = "screen_share";
  const stopIcon = "stop_screen_share";
  const startText = "Launch projection";
  const dropdownIcon = "expand_more";
  const title = "Shift + P";
  let startHandler: ReturnType<typeof vi.fn>;
  let stopHandler: ReturnType<typeof vi.fn>;

  // Setup the user for events.
  const user = userEvent.setup();

  beforeEach(() => {
    startHandler = vi.fn();
    stopHandler = vi.fn();
  });

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
      `<span class="material-symbols-outlined transition">${startIcon}</span>`,
    );
    expect(el).toHaveAccessibleName(
      `${startIcon} ${startText} ${dropdownIcon}`,
    );
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
      `<span class="material-symbols-outlined transition group-hover:text-sky-600">${startIcon}</span>`,
    );
    expect(firstEl).toHaveAccessibleName(
      `${startIcon} ${startText} ${dropdownIcon}`,
    );
    expect(firstEl).toHaveAttribute("title", title);

    // Make the assertions on the second button.
    expect(secondEl).toContainHTML(
      `<span class="material-symbols-outlined transition">${stopIcon}</span>`,
    );
    expect(secondEl).toHaveAccessibleName(`${stopIcon}`);
  });

  test("it should open dropdown when clicking the main button", async () => {
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

    // Get the main button and click it.
    const [mainButton] = screen.getAllByRole("button");
    await user.click(mainButton);

    // Dropdown should now be visible with both options.
    expect(screen.getByText("Audience view")).toBeInTheDocument();
    expect(screen.getByText("Prompter view")).toBeInTheDocument();
  });

  test("it should call start handler with audience type when clicking Audience view", async () => {
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

    // Open dropdown.
    const [mainButton] = screen.getAllByRole("button");
    await user.click(mainButton);

    // Click the audience option.
    await user.click(screen.getByText("Audience view"));

    // Make the assertions.
    expect(startHandler).toHaveBeenCalledOnce();
    expect(startHandler).toHaveBeenCalledWith(IProjectionScreenTypes.audience);
  });

  test("it should call start handler with prompter type when clicking Prompter view", async () => {
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

    // Open dropdown.
    const [mainButton] = screen.getAllByRole("button");
    await user.click(mainButton);

    // Click the prompter option.
    await user.click(screen.getByText("Prompter view"));

    // Make the assertions.
    expect(startHandler).toHaveBeenCalledOnce();
    expect(startHandler).toHaveBeenCalledWith(IProjectionScreenTypes.prompter);
  });

  test("it should close dropdown after selecting an option", async () => {
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

    // Open dropdown.
    const [mainButton] = screen.getAllByRole("button");
    await user.click(mainButton);

    // Dropdown should be visible.
    expect(screen.getByText("Audience view")).toBeInTheDocument();

    // Click an option.
    await user.click(screen.getByText("Audience view"));

    // Dropdown should be closed.
    expect(screen.queryByText("Audience view")).not.toBeInTheDocument();
  });

  test("it should toggle dropdown icon when opened", async () => {
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

    // Initially should show expand_more.
    expect(screen.getByText("expand_more")).toBeInTheDocument();

    // Open dropdown.
    const [mainButton] = screen.getAllByRole("button");
    await user.click(mainButton);

    // Should now show expand_less.
    expect(screen.getByText("expand_less")).toBeInTheDocument();
  });

  test("it should call the stop handler when clicking stop button", async () => {
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

    // Get the stop button (second button) and click it.
    const [, stopButton] = screen.getAllByRole("button");
    await user.click(stopButton);

    // Make the assertions.
    expect(stopHandler).toHaveBeenCalledOnce();
  });

  test("it should not open dropdown when not available", async () => {
    // Render the component onto the vDOM.
    render(() => (
      <ProjectionButton
        title={title}
        isAvailable={false}
        isProjecting={false}
        startHandler={startHandler}
        stopHandler={stopHandler}
      />
    ));

    // Get the main button - it should be disabled.
    const [mainButton] = screen.getAllByRole("button");
    expect(mainButton).toBeDisabled();

    // Dropdown options should not be visible.
    expect(screen.queryByText("Audience view")).not.toBeInTheDocument();
  });

  test("it should hide stop button when not projecting", () => {
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

    // Only the main button should be visible.
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  test("it should show both buttons when projecting", () => {
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

    // Both buttons should be visible.
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
