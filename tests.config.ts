import { cleanup } from "@solidjs/testing-library";
import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect } from "vitest";

// Extend Jest matchers
expect.extend(matchers);

// Clean up the vDOM after each test.
afterEach(() => cleanup());
