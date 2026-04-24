import { describe, expect, it } from "vitest";

import { loaderRegistry } from "./registry-config";

describe("registry config", () => {
  it("contains at least one loader entry", () => {
    expect(loaderRegistry.length).toBeGreaterThan(0);
  });

  it("uses unique slugs", () => {
    const slugs = loaderRegistry.map((loader) => loader.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
