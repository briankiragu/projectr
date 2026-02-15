import { test, expect } from "@playwright/test";

test.describe("Audience Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/audience/test-session");
  });

  test("should display the audience projection view", async ({ page }) => {
    // The page should load without errors
    await expect(page.locator("div.flex.h-dvh")).toBeVisible();
  });

  test("should show background logo when no content is playing", async ({
    page,
  }) => {
    // When no content is playing, the background should have the logo
    const contentArea = page.locator('div[class*="bg-contain"]');
    await expect(contentArea).toBeVisible();
  });

  test("should be responsive on various screen sizes", async ({ page }) => {
    // Test on a large display (typical projection)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("div.flex.h-dvh")).toBeVisible();

    // Test on 4K display
    await page.setViewportSize({ width: 3840, height: 2160 });
    await expect(page.locator("div.flex.h-dvh")).toBeVisible();
  });

  test("should update content when receiving broadcast message", async ({
    page,
  }) => {
    // Simulate receiving a broadcast message
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song",
          content: [["Line 1", "Line 2"]],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Verify title is visible (only on verse index 0)
    await expect(page.locator("h2", { hasText: "Test Song" })).toBeVisible();

    // Verify lyrics are visible
    await expect(page.getByText("Line 1")).toBeVisible();
    await expect(page.getByText("Line 2")).toBeVisible();
  });
});

test.describe("Prompter Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prompter/test-session");
  });

  test("should display the prompter view", async ({ page }) => {
    // The page should load without errors
    await expect(page.locator("div")).toBeVisible();
  });

  test("should be responsive on various screen sizes", async ({ page }) => {
    // Test on standard monitor
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("body")).toBeVisible();

    // Test on tablet (for stage monitor)
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Navigation Between Pages", () => {
  test("should navigate to audience page", async ({ page }) => {
    await page.goto("/audience/123");
    await expect(page).toHaveURL(/\/audience\/123/);
  });

  test("should navigate to prompter page", async ({ page }) => {
    await page.goto("/prompter/456");
    await expect(page).toHaveURL(/\/prompter\/456/);
  });

  test("should handle route without ID", async ({ page }) => {
    await page.goto("/audience");
    // Page should still load
    await expect(page.locator("body")).toBeVisible();
  });
});
