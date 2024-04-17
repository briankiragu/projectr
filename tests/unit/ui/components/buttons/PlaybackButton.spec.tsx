import PlaybackButton from "@components/buttons/PlaybackButton";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

describe("<PlaybackButton />", () => {
  // Define the component values.
  const icon = "arrow_back";
  const text = "Previous verse";
  const title = "ArrowLeft";

  test("it will render an icon, text and a title", () => {
    // Render the button onto the virtual DOM.
    render(() => (
      <PlaybackButton
        icon={icon}
        text={text}
        title={title}
        isEnabled={true}
        handler={() => ({})}
      />
    ));

    // From the screen, get the rendered element.
    const el = screen.getByRole("button");

    // Run the assertions.
    expect(el).toContainHTML(
      `<span class="material-symbols-outlined transition">${icon}</span>`
    );
    expect(el).toHaveAccessibleName(`${icon} ${text}`);
    expect(el).toHaveAttribute("title", title);
  });

  test("it will be disabled", () => {
    render(() => (
      <PlaybackButton
        icon={icon}
        text={text}
        title={title}
        isEnabled={false}
        handler={() => ({})}
      />
    ));

    const el = screen.getByRole("button");

    expect(el).toBeDisabled();
  });
});
