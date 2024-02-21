import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { join } from "path";
import { partytownVite } from "@builder.io/partytown/utils";

export default defineConfig({
  plugins: [
    solid(),
    partytownVite({
      dest: join(__dirname, "dist", "~partytown"),
    }),
  ],
});
