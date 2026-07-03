import {
  FULL_INDEXES_3,
  getPattern3Indexes,
  OUTLINE_INDEXES_3,
  rowMajorIndex3,
  distanceFromCenter3
} from "../core/patterns-3";

describe("3x3 pattern maps", () => {
  it("keeps the expected 3x3 footprint", () => {
    expect(FULL_INDEXES_3).toHaveLength(9);
    expect(OUTLINE_INDEXES_3).toHaveLength(8);
    expect(getPattern3Indexes("cross")).toHaveLength(5);
  });

  it("returns zero center distance for the middle dot", () => {
    expect(distanceFromCenter3(rowMajorIndex3(1, 1))).toBe(0);
  });
});
