/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { join, resolve } from "path";
import { partytownVite } from "@builder.io/partytown/utils";

export default defineConfig({
  plugins: [
    solid(),
    partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
  ],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/ui/components"),
      "@composables": resolve(__dirname, "./src/lib/composables"),
      "@interfaces": resolve(__dirname, "./src/lib/interfaces"),
      "@pages": resolve(__dirname, "./src/ui/pages"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "node_modules/@testing-library/jest-dom/vitest",
      "tests.config",
    ],
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      thresholds: {
        // lines: 80,
        // branches: 80,
        // functions: 80,
        // statements: 80,
      },
    },
    // if you have few tests, try commenting this
    // out to improve performance:
    isolate: true,
    pool: "forks",
    poolOptions: { forks: { isolate: true } },
    deps: {
      optimizer: {
        web: { exclude: ["solid-js"] },
      },
    },
    clearMocks: true,
  },
});
