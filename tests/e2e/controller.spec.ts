import { test, expect } from "@playwright/test";

test.describe("Controller Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main controller interface", async ({ page }) => {
    // Check for search section
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();

    // Check for now playing section
    await expect(page.getByText("Now Playing")).toBeVisible();

    // Check for up next section
    await expect(page.getByText("Up next")).toBeVisible();

    // Check for control buttons
    await expect(page.getByText("Launch projection")).toBeVisible();
    await expect(page.getByText("Previous verse")).toBeVisible();
    await expect(page.getByText("Next verse")).toBeVisible();
    await expect(page.getByText("Next track")).toBeVisible();
  });

  test("should have a search input for lyrics", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test("should toggle between lyrics and scriptures search", async ({
    page,
  }) => {
    // Initially shows "lyrics" in the search heading
    await expect(
      page.locator("h2 span.text-indigo-600", { hasText: "lyrics" })
    ).toBeVisible();

    // Find and click the toggle button
    const toggleButton = page.locator('button:has-text("toggle_on")');
    await toggleButton.click();

    // Should now show "scripture" in the heading
    await expect(
      page.locator("h2 span.text-indigo-600", { hasText: "scripture" })
    ).toBeVisible();
  });

  test("should display waiting message when no content is queued", async ({
    page,
  }) => {
    await expect(
      page.getByText("Waiting for content to be queued...")
    ).toBeVisible();
  });

  test("should have disabled playback controls when nothing is playing", async ({
    page,
  }) => {
    // Previous and Next verse buttons should be disabled
    const prevButton = page.getByRole("button", { name: /previous verse/i });
    const nextButton = page.getByRole("button", { name: /next verse/i });

    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeDisabled();
  });

  test("should show projection dropdown on button click", async ({ page }) => {
    const projectionButton = page.getByRole("button", {
      name: /launch projection/i,
    });
    await projectionButton.click();

    // Check for dropdown menu options
    await expect(page.getByText("Audience")).toBeVisible();
    await expect(page.getByText("Prompter")).toBeVisible();
  });

  test("should navigate using keyboard shortcuts", async ({ page }) => {
    // Focus the page
    await page.keyboard.press("Tab");

    // Test arrow key navigation (should not throw errors even without content)
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");

    // Page should still be functional
    await expect(page.getByText("Now Playing")).toBeVisible();
  });

  test("should display scriptures form when toggled", async ({ page }) => {
    // Toggle to scriptures
    const toggleButton = page.locator('button:has-text("toggle_on")');
    await toggleButton.click();

    // Should show version selector
    await expect(page.getByText("Choose a version")).toBeVisible();
  });
});

test.describe("Controller Page - Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should allow typing in search input", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );

    await searchInput.fill("Amazing Grace");

    await expect(searchInput).toHaveValue("Amazing Grace");
  });

  test("should clear search input", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );

    await searchInput.fill("Test search");
    await searchInput.clear();

    await expect(searchInput).toHaveValue("");
  });
});

test.describe("Controller Page - Responsive Design", () => {
  test("should be responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Main elements should still be visible
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
    await expect(page.getByText("Now Playing")).toBeVisible();
  });

  test("should be responsive on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Main elements should still be visible
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
    await expect(page.getByText("Now Playing")).toBeVisible();
  });

  test("should be responsive on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // All elements should be visible on desktop
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
    await expect(page.getByText("Now Playing")).toBeVisible();
    await expect(page.getByText("Launch projection")).toBeVisible();
  });
});
