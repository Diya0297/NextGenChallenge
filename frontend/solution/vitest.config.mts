import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Based on node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md.
// tsconfigPaths lets tests use the "@/..." import shortcut.
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
