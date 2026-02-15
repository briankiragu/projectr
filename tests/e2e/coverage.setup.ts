import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coverageDir = path.resolve(__dirname, "../../.nyc_output");

// Ensure coverage output directory exists
if (!fs.existsSync(coverageDir)) {
  fs.mkdirSync(coverageDir, { recursive: true });
}

/**
 * Extended test fixture that collects Istanbul coverage data
 * from `window.__coverage__` after each test.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Use the page as normal
    await use(page);

    // After the test, collect coverage data
    try {
      const coverage = await page.evaluate(() => {
        return JSON.stringify((window as any).__coverage__ ?? null);
      });

      if (coverage && coverage !== "null") {
        const id = crypto.randomUUID();
        const coveragePath = path.join(coverageDir, `coverage-${id}.json`);
        fs.writeFileSync(coveragePath, coverage);
        console.log(`Coverage written: ${coveragePath} (${coverage.length} bytes)`);
      } else {
        console.log("No __coverage__ found on window");
      }
    } catch (e) {
      console.log("Coverage collection error:", e);
    }
  },
});

export { expect };
