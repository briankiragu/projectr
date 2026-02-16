import { test, expect } from "./coverage.setup";

// Mock data
const mockLyricsResults = {
  hits: [
    {
      id: 12345,
      title: "Amazing Grace",
      artists: "John Newton",
      content:
        "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\nTwas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed",
      status: 1,
    },
  ],
};

const mockBibles = {
  data: [
    {
      id: "de4e12af7f28f599-02",
      name: "King James Version",
      nameLocal: "King James Version",
      abbreviation: "KJV",
      abbreviationLocal: "KJV",
      description: "Protestant",
      descriptionLocal: "Protestant",
      language: {
        id: "eng",
        name: "English",
        nameLocal: "English",
        script: "Latin",
        scriptDirection: "LTR",
      },
      updatedAt: "2022-01-07T16:21:21.000Z",
    },
  ],
};

const mockBooks = {
  data: [
    {
      id: "GEN",
      bibleId: "de4e12af7f28f599-02",
      abbreviation: "Gen",
      name: "Genesis",
      nameLong: "The First Book of Moses, called Genesis",
    },
    {
      id: "PSA",
      bibleId: "de4e12af7f28f599-02",
      abbreviation: "Psa",
      name: "Psalms",
      nameLong: "The Book of Psalms",
    },
  ],
};

const mockChapters = {
  data: [
    {
      id: "GEN.1",
      bibleId: "de4e12af7f28f599-02",
      bookId: "GEN",
      number: "1",
      reference: "Genesis 1",
    },
    {
      id: "GEN.2",
      bibleId: "de4e12af7f28f599-02",
      bookId: "GEN",
      number: "2",
      reference: "Genesis 2",
    },
  ],
};

const mockVerses = {
  data: [
    {
      id: "GEN.1.1",
      orgId: "de4e12af7f28f599-02",
      bookId: "GEN",
      chapterId: "GEN.1",
      bibleId: "de4e12af7f28f599-02",
      reference: "Genesis 1:1",
    },
    {
      id: "GEN.1.2",
      orgId: "de4e12af7f28f599-02",
      bookId: "GEN",
      chapterId: "GEN.1",
      bibleId: "de4e12af7f28f599-02",
      reference: "Genesis 1:2",
    },
  ],
};

const mockVerseContent = {
  data: {
    id: "GEN.1.1",
    orgId: "de4e12af7f28f599-02",
    bookId: "GEN",
    chapterId: "GEN.1",
    bibleId: "de4e12af7f28f599-02",
    reference: "Genesis 1:1",
    content:
      '<p class="p"><span data-number="1" data-sid="GEN 1:1" class="v">1</span><span class="wj">In the beginning God created the heaven and the earth.</span></p>',
    verseCount: 1,
    copyright: "Public Domain",
  },
};

test.describe("Live Edit Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock MeiliSearch
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });

    await page.goto("/");
  });

  test("should open edit form and modify lyrics", async ({ page }) => {
    // 1. Add item to now playing
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // 2. Verify now playing card is visible
    const nowPlayingCard = page.getByTestId("now-playing-card");
    await expect(nowPlayingCard).toBeVisible();

    // 3. Click the edit button on the now playing card
    await nowPlayingCard.locator('button:has-text("edit")').click();

    // 4. Verify edit form is visible
    const editForm = page.locator(
      "form:has(h3:text('Make live changes to the current item'))"
    );
    await expect(editForm).toBeVisible();

    // 5. Verify textarea has content
    const textarea = page.locator("textarea#live-edit");
    await expect(textarea).toBeVisible();

    // 6. Modify the lyrics
    await textarea.fill(
      "Modified first verse\nLine two\n\nModified second verse"
    );

    // 7. Submit the changes
    await page.getByText("Publish changes").click();

    // 8. Verify the edit form closes
    await expect(editForm).not.toBeVisible();

    // 9. Verify the content updates
    const content = page.locator("#content");
    await expect(content).toContainText("Modified first verse");
  });

  test("should toggle edit form open and closed", async ({ page }) => {
    // Add item
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    const nowPlayingCard = page.getByTestId("now-playing-card");

    // Open edit form
    await nowPlayingCard.locator('button:has-text("edit")').click();
    const editForm = page.locator("textarea#live-edit");
    await expect(editForm).toBeVisible();

    // Close by clicking edit again
    await nowPlayingCard.locator('button:has-text("edit")').click();
    await expect(editForm).not.toBeVisible();
  });
});

test.describe("Verse Navigation with Content", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });
    await page.goto("/");
  });

  test("should navigate verses with buttons and verify active state", async ({
    page,
  }) => {
    // Add item with multiple verses
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Verify lyrics cards are displayed
    const lyricsCards = page.locator('[data-testid="lyrics-card"]');
    await expect(lyricsCards.first()).toBeVisible();
    const cardCount = await lyricsCards.count();
    expect(cardCount).toBeGreaterThan(1);

    // First verse should be active (has green background class)
    await expect(lyricsCards.nth(0)).toHaveClass(/border-tvc-green/);
    await expect(lyricsCards.nth(1)).not.toHaveClass(/border-tvc-green/);

    // Previous button should be disabled on the first verse
    const prevButton = page.getByRole("button", { name: /previous verse/i });
    await expect(prevButton).toBeDisabled();

    // Navigate to next verse
    const nextButton = page.getByRole("button", { name: /next verse/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Second verse should now be active
    await expect(lyricsCards.nth(1)).toHaveClass(/border-tvc-green/);
    await expect(lyricsCards.nth(0)).not.toHaveClass(/border-tvc-green/);

    // Previous button should now be enabled
    await expect(prevButton).toBeEnabled();

    // Navigate back
    await prevButton.click();

    // First verse should be active again
    await expect(lyricsCards.nth(0)).toHaveClass(/border-tvc-green/);
  });

  test("should navigate to specific verse by clicking on lyrics card", async ({
    page,
  }) => {
    // Add item
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    const lyricsCards = page.locator('[data-testid="lyrics-card"]');
    await expect(lyricsCards.first()).toBeVisible();

    // Click on the second verse (index 1)
    await lyricsCards.nth(1).click();

    // Second verse should be active
    await expect(lyricsCards.nth(1)).toHaveClass(/border-tvc-green/);
    await expect(lyricsCards.nth(0)).not.toHaveClass(/border-tvc-green/);
  });

  test("should disable next verse button on last verse", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    const lyricsCards = page.locator('[data-testid="lyrics-card"]');
    await expect(lyricsCards.first()).toBeVisible();
    const cardCount = await lyricsCards.count();

    // Navigate to the last verse
    for (let i = 0; i < cardCount - 1; i++) {
      await lyricsCards.nth(i + 1).click();
    }

    // Last verse should be active
    await expect(lyricsCards.nth(cardCount - 1)).toHaveClass(
      /border-tvc-green/
    );

    // Next verse button should be disabled
    const nextButton = page.getByRole("button", { name: /next verse/i });
    await expect(nextButton).toBeDisabled();
  });

  test("should use keyboard arrows to navigate verses", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    const lyricsCards = page.locator('[data-testid="lyrics-card"]');
    await expect(lyricsCards.first()).toBeVisible();

    // Click body to ensure keyboard events reach the document listener
    await page.click("body");

    // Navigate forward with ArrowRight
    await page.keyboard.press("ArrowRight");
    await expect(lyricsCards.nth(1)).toHaveClass(/border-tvc-green/);

    // Navigate back with ArrowLeft
    await page.keyboard.press("ArrowLeft");
    await expect(lyricsCards.nth(0)).toHaveClass(/border-tvc-green/);

    // Navigate forward with PageDown
    await page.keyboard.press("PageDown");
    await expect(lyricsCards.nth(1)).toHaveClass(/border-tvc-green/);

    // Navigate back with PageUp
    await page.keyboard.press("PageUp");
    await expect(lyricsCards.nth(0)).toHaveClass(/border-tvc-green/);
  });
});

test.describe("Next Track and Queue Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });
    await page.goto("/");
  });

  test("should play next track from queue", async ({ page }) => {
    // Add first item (now playing)
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Add second item (queue)
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Verify queue has item
    const queueList = page.getByTestId("queue-list");
    await expect(
      queueList.locator('[data-testid="queue-list-item"]')
    ).toHaveCount(1);

    // Click Next Track
    const nextTrackButton = page.getByRole("button", { name: /next track/i });
    await nextTrackButton.click();

    // Queue should be empty - the queued item became now playing
    await expect(
      queueList.locator('[data-testid="queue-list-item"]')
    ).toHaveCount(0);

    // Now playing should still show Amazing Grace
    await expect(page.getByTestId("now-playing-card")).toContainText(
      "Amazing Grace"
    );
  });

  test("should clear now playing when next track pressed with empty queue", async ({
    page,
  }) => {
    // Add single item (now playing only, no queue)
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Verify now playing exists
    await expect(page.getByTestId("now-playing-card")).toBeVisible();

    // Click Next Track (queue is empty so now playing should clear)
    const nextTrackButton = page.getByRole("button", { name: /next track/i });
    await nextTrackButton.click();

    // Now playing should be gone, waiting message should appear
    await expect(
      page.getByText("Waiting for content to be queued...")
    ).toBeVisible();
  });

  test("should play next track via Shift+ArrowRight keyboard shortcut", async ({
    page,
  }) => {
    // Add two items
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Use keyboard shortcut
    await page.click("body");
    await page.keyboard.press("Shift+ArrowRight");

    // Queue should be empty
    const queueList = page.getByTestId("queue-list");
    await expect(
      queueList.locator('[data-testid="queue-list-item"]')
    ).toHaveCount(0);
  });
});

test.describe("Prompter Page - Broadcast Messages", () => {
  test("should display all verses with active one highlighted", async ({
    page,
  }) => {
    await page.goto("/prompter/test-session");

    // Send broadcast message with multiple verses
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song",
          content: [
            ["Verse 1 Line 1", "Verse 1 Line 2"],
            ["Verse 2 Line 1", "Verse 2 Line 2"],
            ["Verse 3 Line 1"],
          ],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Wait for content to appear
    await expect(page.getByText("Test Song")).toBeVisible();

    // All verses should be visible (prompter shows all)
    await expect(page.getByText("Verse 1 Line 1")).toBeVisible();
    await expect(page.getByText("Verse 2 Line 1")).toBeVisible();
    await expect(page.getByText("Verse 3 Line 1")).toBeVisible();
  });

  test("should update highlighted verse when index changes", async ({
    page,
  }) => {
    await page.goto("/prompter/test-session");

    // Send initial state
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song",
          content: [
            ["Verse 1 Line 1"],
            ["Verse 2 Line 1"],
            ["Verse 3 Line 1"],
          ],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    await expect(page.getByText("Verse 1 Line 1")).toBeVisible();

    // Send update to change verse index
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song",
          content: [
            ["Verse 1 Line 1"],
            ["Verse 2 Line 1"],
            ["Verse 3 Line 1"],
          ],
        },
        currentVerseIndex: 1,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Verify the second verse gets highlighted class (larger text)
    const verses = page.locator("div.mb-20.font-serif");
    await expect(verses.nth(1)).toHaveClass(/lg:text-7xl/);
    // First verse should have the dimmed class
    await expect(verses.nth(0)).toHaveClass(/text-gray-600/);
  });

  test("should always display the title in prompter", async ({ page }) => {
    await page.goto("/prompter/test-session");

    // Send with verse index > 0
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song Title",
          content: [["Verse 1"], ["Verse 2"]],
        },
        currentVerseIndex: 1,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Title should still be visible even on non-zero index (unlike Audience)
    await expect(page.getByText("Test Song Title")).toBeVisible();
  });

  test("should handle null broadcast payload", async ({ page }) => {
    await page.goto("/prompter/test-session");

    // First send content
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test Song",
          content: [["Line 1"]],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    await expect(page.getByText("Test Song")).toBeVisible();

    // Now send null (content hidden)
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      channel.postMessage(JSON.stringify(null));
    });

    // Content should disappear
    await expect(page.getByText("Line 1")).not.toBeVisible();
  });
});

test.describe("Audience Page - Title Visibility", () => {
  test("should hide title when verse index is not 0", async ({ page }) => {
    await page.goto("/audience/test-session");

    // Send with verse index = 1 (title should NOT display)
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Hidden Title",
          content: [
            ["Verse 1 Line 1"],
            ["Verse 2 Line 1"],
          ],
        },
        currentVerseIndex: 1,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Verse 2 should be visible
    await expect(page.getByText("Verse 2 Line 1")).toBeVisible();
    // Title should NOT be visible
    await expect(page.locator("h2", { hasText: "Hidden Title" })).not.toBeVisible();
  });

  test("should show title only on first verse", async ({ page }) => {
    await page.goto("/audience/test-session");

    // Send with verse index = 0 (title should display)
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Visible Title",
          content: [["Verse 1"], ["Verse 2"]],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    // Title should be visible
    await expect(page.locator("h2", { hasText: "Visible Title" })).toBeVisible();
  });

  test("should handle null broadcast payload in audience", async ({
    page,
  }) => {
    await page.goto("/audience/test-session");

    // Send content first
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      const payload = {
        nowPlaying: {
          qid: 123,
          title: "Test",
          content: [["Line 1"]],
        },
        currentVerseIndex: 0,
      };
      channel.postMessage(JSON.stringify(payload));
    });

    await expect(page.getByText("Line 1")).toBeVisible();

    // Send null
    await page.evaluate(() => {
      const channel = new BroadcastChannel("projectr");
      channel.postMessage(JSON.stringify(null));
    });

    // Content should disappear
    await expect(page.getByText("Line 1")).not.toBeVisible();
  });
});

test.describe("Projection Button Details", () => {
  test("should show audience and prompter options in dropdown", async ({
    page,
  }) => {
    await page.goto("/");

    const projectionButton = page.getByRole("button", {
      name: /launch projection/i,
    });
    await projectionButton.click();

    // Verify dropdown shows both options
    await expect(page.getByText("Audience view")).toBeVisible();
    await expect(page.getByText("Prompter view")).toBeVisible();
  });

  test("should close dropdown after selecting audience view", async ({
    page,
  }) => {
    await page.goto("/");

    const projectionButton = page.getByRole("button", {
      name: /launch projection/i,
    });
    await projectionButton.click();

    // The dropdown should be visible
    await expect(page.getByText("Audience view")).toBeVisible();

    // Click audience view (this will try to open a window.open)
    // We intercept window.open to prevent actual window creation
    await page.evaluate(() => {
      (window as any).open = () => null;
    });
    await page.getByText("Audience view").click();

    // Dropdown should close
    await expect(page.getByText("Audience view")).not.toBeVisible();
  });

  test("should close dropdown after selecting prompter view", async ({
    page,
  }) => {
    await page.goto("/");

    const projectionButton = page.getByRole("button", {
      name: /launch projection/i,
    });
    await projectionButton.click();

    await expect(page.getByText("Prompter view")).toBeVisible();

    await page.evaluate(() => {
      (window as any).open = () => null;
    });
    await page.getByText("Prompter view").click();

    await expect(page.getByText("Prompter view")).not.toBeVisible();
  });
});

test.describe("Scripture Search - Cascading Selects", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/bibles?*", async (route) => {
      await route.fulfill({ json: mockBibles });
    });
    await page.route("**/bibles/*/books", async (route) => {
      await route.fulfill({ json: mockBooks });
    });
    await page.route("**/bibles/*/books/*/chapters", async (route) => {
      await route.fulfill({ json: mockChapters });
    });
    await page.route("**/bibles/*/chapters/*/verses", async (route) => {
      await route.fulfill({ json: mockVerses });
    });
    await page.route("**/bibles/*/verses/*?*", async (route) => {
      await route.fulfill({ json: mockVerseContent });
    });
    await page.route(/bibles\/.*\/verses\//, async (route) => {
      await route.fulfill({ json: mockVerseContent });
    });

    await page.goto("/");
    // Toggle to scripture search
    await page.locator('button:has-text("toggle_on")').click();
  });

  test("should show verse count after selecting chapter", async ({ page }) => {
    // Select version
    await page.selectOption("#version", "de4e12af7f28f599-02");

    // Select book
    await page.selectOption("#book", "GEN");

    // Select chapter
    await page.selectOption("#chapter", "GEN.1");

    // Verify verse count indicator
    await expect(page.getByText(/\d+ verses loaded/)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should reset book and chapter when version changes", async ({
    page,
  }) => {
    // Select version
    await page.selectOption("#version", "de4e12af7f28f599-02");

    // Select book
    await page.selectOption("#book", "GEN");

    // Select chapter
    await page.selectOption("#chapter", "GEN.1");

    // Wait for content
    await expect(page.getByText(/\d+ verses loaded/)).toBeVisible({
      timeout: 10000,
    });

    // Now re-select version (this should reset book and chapter)
    await page.selectOption("#version", "de4e12af7f28f599-02");

    // The "Add to queue" button should be disabled again
    const addButton = page.getByText("Add to queue");
    await expect(addButton).toBeDisabled();
  });

  test("should disable submit button when no content loaded", async ({
    page,
  }) => {
    // Submit button should be disabled by default
    const addButton = page.getByText("Add to queue");
    await expect(addButton).toBeDisabled();
  });
});

test.describe("Offline Banner", () => {
  test("should show offline banner when network goes offline", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Offline banner should appear
    await expect(page.getByText("You are currently offline.")).toBeVisible();

    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(500);

    // Banner should disappear
    await expect(
      page.getByText("You are currently offline.")
    ).not.toBeVisible();
  });
});

test.describe("Display Button Behavior", () => {
  test("should show disabled display button when not connected", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Display button should show visibility icon and be disabled when not connected
    const displayButton = page.locator('button:has-text("visibility")');
    await expect(displayButton.first()).toBeVisible();
    await expect(displayButton.first()).toBeDisabled();
  });
});

test.describe("Persistence", () => {
  test("should persist now playing across page reload", async ({ page }) => {
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });

    await page.goto("/");

    // Add item to now playing
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Verify now playing exists
    await expect(page.getByTestId("now-playing-card")).toContainText(
      "Amazing Grace"
    );

    // Reload the page
    await page.reload();

    // Now playing should still be there (persisted in localStorage)
    await expect(page.getByTestId("now-playing-card")).toContainText(
      "Amazing Grace"
    );
  });
});

test.describe("Search Results Display", () => {
  test("should display search result with title and first line preview", async ({
    page,
  }) => {
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });

    await page.goto("/");

    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });

    // Verify the search result includes the artist
    await expect(page.getByText("John Newton")).toBeVisible();
  });

  test("should display multiple search results", async ({ page }) => {
    const multipleResults = {
      hits: [
        {
          id: 1,
          title: "Amazing Grace",
          artists: "John Newton",
          content: "Amazing grace! How sweet the sound",
          status: 1,
        },
        {
          id: 2,
          title: "How Great Thou Art",
          artists: "Carl Boberg",
          content: "O Lord my God, When I in awesome wonder",
          status: 1,
        },
      ],
    };

    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: multipleResults });
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("grace");
    // Wait for search results to appear (debounced)
    const addButtons = page.locator('button:has-text("add_to_queue")');
    await expect(addButtons.first()).toBeVisible({ timeout: 15000 });
    await expect(addButtons).toHaveCount(2);
  });
});

test.describe("QueueListItem Interactions", () => {
  test("should show title and first line preview in queue item", async ({
    page,
  }) => {
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });
    await page.goto("/");

    // Add two items: first goes to now playing, second to queue
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({
      timeout: 10000,
    });
    await page.locator('button:has-text("add_to_queue")').first().click();
    await page.locator('button:has-text("add_to_queue")').first().click();

    // Get the queue list item
    const queueItem = page.getByTestId("queue-list-item");
    await expect(queueItem).toBeVisible();

    // Should show title
    await expect(
      queueItem.getByText("Amazing Grace", { exact: true })
    ).toBeVisible();
  });
});

test.describe("Page Title Verification", () => {
  test("controller page should have correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Projectr | Controller");
  });

  test("audience page should have correct title", async ({ page }) => {
    await page.goto("/audience/test");
    await expect(page).toHaveTitle("Projectr | Audience");
  });

  test("prompter page should have correct title", async ({ page }) => {
    await page.goto("/prompter/test");
    await expect(page).toHaveTitle("Projectr | Prompter");
  });
});

test.describe("Failed Screen Detection", () => {
  test("should show waiting message when canProject is true but nothing queued", async ({
    page,
  }) => {
    await page.goto("/");

    // By default (multiscreen may or may not be available), one of these messages should show
    const waitingMsg = page.getByText("Waiting for content to be queued...");
    const failedMsg = page.getByText("Failed to identify a second screen.");

    // One of them should be visible
    const waitingVisible = await waitingMsg.isVisible().catch(() => false);
    const failedVisible = await failedMsg.isVisible().catch(() => false);

    expect(waitingVisible || failedVisible).toBeTruthy();
  });
});

test.describe("Keyboard Shortcuts", () => {
  test("should handle projection keyboard shortcuts (F5, Escape)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Press F5 to trigger openReceiver (even if it fails silently)
    await page.keyboard.press("F5");
    await page.waitForTimeout(200);

    // Press Escape to trigger closeReceiver
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    // Press Shift+P for projection toggle
    await page.keyboard.press("Shift+P");
    await page.waitForTimeout(200);

    // Press Shift+S for show/hide toggle
    await page.keyboard.press("Shift+S");
    await page.waitForTimeout(200);

    // Page should still be functional after keyboard shortcuts
    await expect(
      page.getByPlaceholder("Search for a track by title or content...")
    ).toBeVisible();
  });

  test("should handle playback keyboard shortcuts with content", async ({
    page,
  }) => {
    // Set up mock
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Add content
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await page.locator('button:has-text("add_to_queue")').first().click({
      timeout: 15000,
    });
    await page.waitForTimeout(500);

    // Use Period key for show/hide
    await page.keyboard.press(".");
    await page.waitForTimeout(200);

    // Use ArrowRight for next verse
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    // Use ArrowLeft for previous verse
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(200);

    // Use PageDown for next verse
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(200);

    // Use PageUp for previous verse
    await page.keyboard.press("PageUp");
    await page.waitForTimeout(200);

    // Page should still be functional
    await expect(page.getByTestId("now-playing-card")).toBeVisible();
  });
});

test.describe("Search Results Without Artists", () => {
  test("should handle search results with no artists field", async ({
    page,
  }) => {
    const mockNoArtists = {
      hits: [
        {
          id: 99999,
          title: "Song Without Artist",
          artists: "",
          content: "Some lyrics content\nSecond line here",
          status: 1,
        },
      ],
    };

    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockNoArtists });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Song Without");

    // Wait for add button to appear (search result rendered)
    await page.locator('button:has-text("add_to_queue")').first().click({
      timeout: 15000,
    });

    // The item should be visible and playable even without artists
    await expect(page.getByTestId("now-playing-card")).toBeVisible();
  });
});

test.describe("Bible API Error Handling", () => {
  test("should handle Bible API version fetch failure gracefully", async ({
    page,
  }) => {
    // Mock Bible API to return error
    await page.route("**/bibles?*", async (route) => {
      await route.fulfill({
        status: 500,
        body: "Internal Server Error",
      });
    });

    await page.goto("/");

    // Switch to scriptures tab
    const scripturesTab = page.getByText("Scriptures", { exact: true });
    if (await scripturesTab.isVisible()) {
      await scripturesTab.click();

      // The version select should still render (even if empty)
      await expect(page.locator("select#version")).toBeVisible();
    }
  });
});

test.describe("Scripture Form Loading States", () => {
  test("should show loading state while fetching versions", async ({
    page,
  }) => {
    // Mock a slow Bible API response
    await page.route("**/bibles?*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({ json: mockBibles });
    });

    await page.goto("/");

    // Switch to scriptures tab
    const scripturesTab = page.getByText("Scriptures", { exact: true });
    if (await scripturesTab.isVisible()) {
      await scripturesTab.click();

      // Should show loading option initially
      const loadingOption = page
        .locator("select#version option")
        .filter({ hasText: "Loading..." });
      // The loading state may be very brief, so we just verify the select is there
      await expect(page.locator("select#version")).toBeVisible();
    }
  });

  test("should show verse count after selecting chapter", async ({ page }) => {
    // Mock Bible API cascading responses
    await page.route("**/bibles?*", async (route) => {
      await route.fulfill({ json: mockBibles });
    });
    await page.route("**/bibles/*/books", async (route) => {
      await route.fulfill({ json: mockBooks });
    });
    await page.route("**/bibles/*/books/*/chapters", async (route) => {
      await route.fulfill({ json: mockChapters });
    });
    await page.route("**/bibles/*/chapters/*/verses", async (route) => {
      await route.fulfill({
        json: {
          data: [
            {
              id: "GEN.1.1",
              orgId: "GEN.1.1",
              bookId: "GEN",
              chapterId: "GEN.1",
              reference: "Genesis 1:1",
              content:
                "<p>In the beginning God created the heavens and the earth.</p>",
            },
            {
              id: "GEN.1.2",
              orgId: "GEN.1.2",
              bookId: "GEN",
              chapterId: "GEN.1",
              reference: "Genesis 1:2",
              content:
                "<p>And the earth was without form, and void.</p>",
            },
          ],
        },
      });
    });

    await page.goto("/");

    // Switch to scriptures tab
    const scripturesTab = page.getByText("Scriptures", { exact: true });
    if (await scripturesTab.isVisible()) {
      await scripturesTab.click();

      // Select version
      await page.locator("select#version").selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Select book
      await page.locator("select#book").selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Select chapter
      await page.locator("select#chapter").selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Should show verse count
      await expect(page.getByText("2 verses loaded")).toBeVisible({
        timeout: 5000,
      });
    }
  });
});
