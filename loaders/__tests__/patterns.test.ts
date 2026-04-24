import {
  DIAMOND_INDEXES,
  FULL_INDEXES,
  OUTLINE_INDEXES,
  distanceFromCenter,
  rowMajorIndex
} from "../core/patterns";

describe("pattern maps", () => {
  it("keeps the expected 5x5 footprint", () => {
    expect(FULL_INDEXES).toHaveLength(25);
    expect(OUTLINE_INDEXES).toHaveLength(16);
    expect(DIAMOND_INDEXES).toHaveLength(13);
  });

  it("returns zero center distance for the middle dot", () => {
    expect(distanceFromCenter(rowMajorIndex(2, 2))).toBe(0);
  });
});
