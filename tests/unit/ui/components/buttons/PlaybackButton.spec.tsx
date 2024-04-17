import PlaybackButton from "@components/buttons/PlaybackButton";
import { render, screen } from "@solidjs/testing-library";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("<PlaybackButton />", () => {
  // Define the component values.
  const icon = "arrow_back";
  const text = "Previous verse";
  const title = "ArrowLeft";
  const fn = vi.fn();

  // Setup user events.
  const user = userEvent.setup();

  test("it should render an icon, text and a title", () => {
    // Render the button onto the virtual DOM.
    render(() => (
      <PlaybackButton
        isEnabled={true}
        icon={icon}
        text={text}
        title={title}
        handler={fn}
      />
    ));

    // From the screen, get the rendered element.
    const el = screen.getByRole("button");

    // Run the assertions.
    expect(el.innerHTML).toMatchSnapshot();
    expect(el).toContainHTML(
      `<span class="material-symbols-outlined transition">${icon}</span>`
    );
    expect(el).toHaveAccessibleName(`${icon} ${text}`);
    expect(el).toHaveAttribute("title", title);
  });

  test("it should be disabled", () => {
    render(() => (
      <PlaybackButton
        isEnabled={false}
        icon={icon}
        text={text}
        title={title}
        handler={fn}
      />
    ));

    const el = screen.getByRole("button");
    expect(el).toBeDisabled();
  });

  test("it should perform a function when clicked", async () => {
    render(() => (
      <PlaybackButton
        isEnabled={true}
        icon={icon}
        text={text}
        title={title}
        handler={fn}
      />
    ));

    const el = screen.getByRole("button");
    await user.pointer({ keys: "[MouseLeft]", target: el });
    await user.pointer({ keys: "[MouseLeft]", target: el });

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
