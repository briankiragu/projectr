/// <reference types="vitest" />
/// <reference types="vite/client" />

import { join, resolve } from "path";

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { partytownVite } from "@qwik.dev/partytown/utils";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
    partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
    ...(process.env.E2E_COVERAGE
      ? [
          istanbul({
            include: "src/**/*",
            exclude: [
              "node_modules",
              "tests",
              "src/vite-env.d.ts",
            ],
            extension: [".ts", ".tsx"],
            requireEnv: false,
            checkProd: false,
          }),
        ]
      : []),
  ],
  build: { target: "esnext" },
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
    include: ["./tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
      exclude: ["src/index.tsx", "public/sw.js"],
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
