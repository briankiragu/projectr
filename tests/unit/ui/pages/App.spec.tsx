import App from "@pages/App";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

describe("<App />", () => {
  test("it renders children correctly", () => {
    // Render the component with children onto the vDOM.
    render(() => (
      <App>
        <div data-testid="child-element">Child Content</div>
      </App>
    ));

    // Get the element from the vDOM.
    const el = screen.getByTestId("child-element");

    // Make the assertions.
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("Child Content");
  });

  test("it applies antialiased styling", () => {
    // Render the component onto the vDOM.
    render(() => (
      <App>
        <span>Test</span>
      </App>
    ));

    // Get the element from the vDOM.
    const el = screen.getByText("Test").parentElement;

    // Make the assertions.
    expect(el).toHaveClass("antialiased");
  });
});
