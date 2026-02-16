import { test, expect } from "./coverage.setup";

test.describe("Full User Journey", () => {
  test("should load the controller and show initial state", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify initial state
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
    await expect(
      page.getByText("Waiting for content to be queued...")
    ).toBeVisible();
    await expect(page.getByText("Now Playing")).toBeVisible();
    await expect(page.getByText("Up next")).toBeVisible();
  });

  test("should handle offline state gracefully", async ({ page, context }) => {
    await page.goto("/");

    // Simulate going offline
    await context.setOffline(true);

    // The page should show offline indicator (if implemented)
    // Wait a moment for the event to propagate
    await page.waitForTimeout(500);

    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(500);

    // Page should still be functional
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
  });

  test("should switch between lyrics and scriptures search modes", async ({
    page,
  }) => {
    await page.goto("/");

    // Start with lyrics search
    await expect(
      page.locator("h2 span.text-indigo-600", { hasText: "lyrics" })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Search for a track by title or content...")
    ).toBeVisible();

    // Toggle to scriptures
    await page.locator('button:has-text("toggle_on")').click();

    // Should now show scripture search form
    await expect(
      page.locator("h2 span.text-indigo-600", { hasText: "scripture" })
    ).toBeVisible();
    await expect(page.locator("select#version")).toBeVisible();

    // Toggle back to lyrics
    await page.locator('button:has-text("toggle_off")').click();
    await expect(
      page.locator("h2 span.text-indigo-600", { hasText: "lyrics" })
    ).toBeVisible();
  });
});

test.describe("Keyboard Navigation", () => {
  test("should handle keyboard shortcuts on controller", async ({ page }) => {
    await page.goto("/");

    // Focus the page first
    await page.click("body");

    // Test Escape key (should not cause errors)
    await page.keyboard.press("Escape");

    // Test Period key (toggle visibility shortcut)
    await page.keyboard.press("Period");

    // Test navigation keys
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("PageUp");
    await page.keyboard.press("PageDown");

    // Page should still be functional after all key presses
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
  });

  test("should handle Shift+key combinations", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
    await page.click("body");

    // Shift+S (toggle display)
    await page.keyboard.press("Shift+KeyS");

    // Shift+ArrowRight (next track)
    await page.keyboard.press("Shift+ArrowRight");

    // Page should remain stable
    await expect(page.getByText("Now Playing")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have proper heading structure", async ({ page }) => {
    await page.goto("/");

    // Check for headings
    const headings = await page.locator("h2, h3").all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test("should have accessible buttons", async ({ page }) => {
    await page.goto("/");

    // All main buttons should be accessible
    const buttons = await page.locator('button[type="button"]').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Check that buttons have some form of accessible name
    for (const button of buttons) {
      const name = await button.getAttribute("title");
      const text = await button.textContent();
      // Button should have either a title or text content
      expect(name || text).toBeTruthy();
    }
  });

  test("should have labeled form inputs", async ({ page }) => {
    await page.goto("/");

    // Search input should be labeled
    const searchInput = page.locator("input#search");
    await expect(searchInput).toBeVisible();

    // Check that it has a label
    const label = page.locator("label[for='search']");
    await expect(label).toBeVisible();
  });
});

test.describe("Performance", () => {
  test("should load controller page within acceptable time", async ({
    page,
  }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Page should load within 10 seconds (generous for CI and parallel workers)
    expect(loadTime).toBeLessThan(10000);
  });

  test("should load audience page within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/audience/test");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Page should load within 30 seconds (generous for coverage-instrumented builds)
    expect(loadTime).toBeLessThan(30000);
  });
});
