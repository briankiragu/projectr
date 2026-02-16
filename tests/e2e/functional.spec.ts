import { test, expect } from "./coverage.setup";

// Mock data
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

const mockLyricsResults = {
  hits: [
    {
      id: 12345,
      title: "Amazing Grace",
      artists: "John Newton",
      content:
        "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.",
      status: 1,
    },
  ],
};

test.describe("Functional Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Bible API
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

    // Mock MeiliSearch
    await page.route(/indexes\/lyrics\/search/, async (route) => {
      await route.fulfill({ json: mockLyricsResults });
    });

    await page.goto("/");
  });

  test("should search for lyrics and add to queue", async ({ page }) => {
    // 1. Search for lyrics
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");

    // Wait for debounce (500ms) and search results
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({ timeout: 10000 });

    // 2. Add to queue (click the add button on the result)
    await page.locator('button:has-text("add_to_queue")').first().click();

    // 3. Verify it's in the Now Playing section (since queue was empty)
    await expect(page.getByText("Now Playing")).toBeVisible();
    // The NowPlayingCard displays the title
    const nowPlayingCard = page.getByTestId("now-playing-card");
    await expect(nowPlayingCard).toContainText("Amazing Grace");

    // 4. Verify content is displayed in the main area
    const title = page.locator("#title");
    await expect(title).toHaveText(/Amazing Grace/i);
    const content = page.locator("#content");
    await expect(content).toContainText("Amazing grace! How sweet the sound");
  });

  test("should search for scripture and add to queue", async ({ page }) => {
    // 1. Toggle to scripture search
    await page.locator('button:has-text("toggle_on")').click();

    // 2. Select Version
    await page.selectOption("#version", "de4e12af7f28f599-02");

    // 3. Select Book
    await page.selectOption("#book", "GEN");

    // 4. Select Chapter
    await page.selectOption("#chapter", "GEN.1");

    // 5. Wait for content to load and "Add to queue" to be enabled
    const addButton = page.getByText("Add to queue");
    await expect(addButton).toBeEnabled();

    // 6. Click Add to Queue
    await addButton.click();

    // 7. Verify it's playing (queue was empty)
    const nowPlayingCard = page.getByTestId("now-playing-card");
    await expect(nowPlayingCard).toContainText("Genesis 1");

    // 8. Verify content
    const title = page.locator("#title");
    await expect(title).toHaveText(/Genesis 1/i);
    const content = page.locator("#content");
    // The mock returns "In the beginning..."
    await expect(content).toContainText("In the beginning");
  });

  test("should queue multiple items and play them", async ({ page }) => {
    // 1. Add lyrics to queue
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("add_to_queue")').first().click(); // This goes to Now Playing

    // 2. Add another item (same one for simplicity)
    await page.locator('button:has-text("add_to_queue")').first().click(); // This goes to Queue

    // 3. Verify Queue has item
    const queueList = page.getByTestId("queue-list");
    await expect(queueList.getByText("Amazing Grace", { exact: true })).toBeVisible();

    // 4. Play the item from queue
    const playButton = queueList.locator('button[title="play"]');
    await playButton.click();

    // Since it's the same title, it's hard to distinguish, but the queue should now be empty if we played the only item.
    await expect(queueList.locator('[data-testid="queue-list-item"]')).toHaveCount(0);
  });

  test("should remove item from queue", async ({ page }) => {
    // 1. Add first item (Now Playing)
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("add_to_queue")').first().click();

    // 2. Add second item (Queue)
    await page.locator('button:has-text("add_to_queue")').first().click();

    // 3. Remove from queue
    const queueList = page.getByTestId("queue-list");
    const removeButton = queueList.locator('button[title="remove"]');
    await removeButton.click();

    // 4. Verify queue is empty
    await expect(queueList.locator('[data-testid="queue-list-item"]')).toHaveCount(0);
    // Now Playing should still be there
    await expect(page.getByTestId("now-playing-card")).toBeVisible();
  });

  test("should clear all items from queue", async ({ page }) => {
    // 1. Add multiple items
    const searchInput = page.getByPlaceholder(
      "Search for a track by title or content..."
    );
    await searchInput.fill("Amazing Grace");
    await expect(page.getByText("Amazing Grace").first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("add_to_queue")').first().click(); // Playing
    await page.locator('button:has-text("add_to_queue")').first().click(); // Queue 1
    await page.locator('button:has-text("add_to_queue")').first().click(); // Queue 2

    // 2. Click Clear All
    await page.getByText("Clear all").click();

    // 3. Verify queue is empty
    const queueList = page.getByTestId("queue-list");
    await expect(queueList.locator('[data-testid="queue-list-item"]')).toHaveCount(0);
  });
});
