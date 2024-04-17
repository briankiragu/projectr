/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import { partytownVite } from "@builder.io/partytown/utils";
import { resolve, join } from "path";

export default defineConfig({
  plugins: [
    solid(),
    partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/ui/components"),
      "@composables": resolve(__dirname, "./src/lib/composables"),
      "@interfaces": resolve(__dirname, "./src/lib/interfaces"),
      "@pages": resolve(__dirname, "./src/ui/pages"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["node_modules/@testing-library/jest-dom/vitest"],
    // if you have few tests, try commenting this
    // out to improve performance:
    // isolate: false,
    pool: "forks",
    poolOptions: { forks: { isolate: false } },
    deps: {
      optimizer: {
        web: { exclude: ["solid-js"] },
      },
    },
  },
});
