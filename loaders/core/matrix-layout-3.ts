import { MATRIX_SIZE_3 } from "./patterns-3";

export function getMatrix3Layout(
  size: number,
  dotSize: number,
  cellPadding?: number
): { gap: number; matrixSpan: number } {
  const n = MATRIX_SIZE_3;
  if (cellPadding != null) {
    const gap = Math.max(0, cellPadding);
    const matrixSpan = dotSize * n + gap * (n - 1);
    return { gap, matrixSpan };
  }
  const gap = Math.max(0, Math.floor((size - dotSize * n) / (n - 1)));
  return { gap, matrixSpan: size };
}
