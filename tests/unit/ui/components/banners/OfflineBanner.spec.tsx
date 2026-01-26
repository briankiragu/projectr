import OfflineBanner from "@components/banners/OfflineBanner";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

describe("<OfflineBanner />", () => {
  test("it renders correctly", () => {
    // Render the component onto the vDOM.
    render(() => <OfflineBanner />);

    // Get the element from the vDOM by text content.
    const el = screen.getByText("You are currently offline.");

    // Make the assertions.
    expect(el).toBeInTheDocument();
  });

  test("it has the correct styling classes", () => {
    // Render the component onto the vDOM.
    render(() => <OfflineBanner />);

    // Get the element from the vDOM.
    const el = screen.getByText("You are currently offline.").parentElement;

    // Make the assertions.
    expect(el).toHaveClass("fixed");
    expect(el).toHaveClass("top-0");
    expect(el).toHaveClass("bg-black");
    expect(el).toHaveClass("text-white");
  });
});
