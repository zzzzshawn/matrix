import { describe, expect, it } from "vitest";

import { FULL_INDEXES } from "../core/patterns";
import { snakePathNormFromIndex, snakePathOrderValue } from "../core/grid-paths";

describe("grid-paths", () => {
  it("snake path is a 0..24 permutation", () => {
    const used = new Set(FULL_INDEXES.map((i) => snakePathOrderValue(i)));
    expect(used.size).toBe(25);
    expect(used.has(0)).toBe(true);
    expect(used.has(24)).toBe(true);
  });

  it("snake norms are 0 and 1 at the ends of the serpentine", () => {
    const a = Math.min(...FULL_INDEXES.map((i) => snakePathNormFromIndex(i)));
    const b = Math.max(...FULL_INDEXES.map((i) => snakePathNormFromIndex(i)));
    expect(a).toBe(0);
    expect(b).toBe(1);
  });
});
