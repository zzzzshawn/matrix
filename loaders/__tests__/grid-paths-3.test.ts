import {
  blTrPath3NormFromIndex,
  brTlPath3NormFromIndex,
  diagonalWave3BandIndex,
  diagonalWave3PathNormFromIndex,
  tlBrPath3NormFromIndex,
  trBlPath3NormFromIndex
} from "../core/grid-paths-3";
import { rowMajorIndex3 } from "../core/patterns-3";

describe("3x3 diagonal paths", () => {
  it("maps corners to 0 and 1 for each sweep direction", () => {
    expect(trBlPath3NormFromIndex(rowMajorIndex3(0, 2))).toBe(0);
    expect(trBlPath3NormFromIndex(rowMajorIndex3(2, 0))).toBe(1);

    expect(tlBrPath3NormFromIndex(rowMajorIndex3(0, 0))).toBe(0);
    expect(tlBrPath3NormFromIndex(rowMajorIndex3(2, 2))).toBe(1);

    expect(brTlPath3NormFromIndex(rowMajorIndex3(2, 2))).toBe(0);
    expect(brTlPath3NormFromIndex(rowMajorIndex3(0, 0))).toBe(1);

    expect(blTrPath3NormFromIndex(rowMajorIndex3(2, 0))).toBe(0);
    expect(blTrPath3NormFromIndex(rowMajorIndex3(0, 2))).toBe(1);
  });

  it("groups dots on the same diagonal band for tl-br", () => {
    expect(diagonalWave3BandIndex(0, 2, "tl-br")).toBe(
      diagonalWave3BandIndex(1, 1, "tl-br")
    );
    expect(diagonalWave3BandIndex(0, 2, "tl-br")).toBe(
      diagonalWave3BandIndex(2, 0, "tl-br")
    );
    expect(
      diagonalWave3PathNormFromIndex(rowMajorIndex3(1, 1), "tl-br")
    ).toBe(0.5);
  });
});
