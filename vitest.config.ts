import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic"
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["loaders/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}"]
  }
});
