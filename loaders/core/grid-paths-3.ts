import { indexToCoord3, MATRIX_SIZE_3, rowMajorIndex3 } from "./patterns-3";

const N = MATRIX_SIZE_3;
const CELLS = N * N;
const MAX_DIAGONAL = (N - 1) * 2;

/** Wavefront from top-right toward bottom-left. */
export function trBlPath3NormFromIndex(index: number): number {
  const { row, col } = indexToCoord3(index);
  return (row + (N - 1 - col)) / MAX_DIAGONAL;
}

/** Wavefront from top-left toward bottom-right. */
export function tlBrPath3NormFromIndex(index: number): number {
  const { row, col } = indexToCoord3(index);
  return (row + col) / MAX_DIAGONAL;
}

/** Wavefront from bottom-right toward top-left. */
export function brTlPath3NormFromIndex(index: number): number {
  const { row, col } = indexToCoord3(index);
  return (MAX_DIAGONAL - row - col) / MAX_DIAGONAL;
}

/** Wavefront from bottom-left toward top-right. */
export function blTrPath3NormFromIndex(index: number): number {
  const { row, col } = indexToCoord3(index);
  return (MAX_DIAGONAL - row - (N - 1 - col)) / MAX_DIAGONAL;
}

export type DiagonalWave3Direction = "tr-bl" | "tl-br" | "br-tl" | "bl-tr";

const DIAGONAL_PATH_3: Record<DiagonalWave3Direction, (index: number) => number> = {
  "tr-bl": trBlPath3NormFromIndex,
  "tl-br": tlBrPath3NormFromIndex,
  "br-tl": brTlPath3NormFromIndex,
  "bl-tr": blTrPath3NormFromIndex
};

export function diagonalWave3PathNormFromIndex(
  index: number,
  direction: DiagonalWave3Direction
): number {
  return DIAGONAL_PATH_3[direction](index);
}

/** Diagonal band index (0…4 on 3×3) — dots on the same band share animation phase. */
export function diagonalWave3BandIndex(
  row: number,
  col: number,
  direction: DiagonalWave3Direction
): number {
  if (direction === "tr-bl" || direction === "bl-tr") {
    return row + (N - 1 - col);
  }
  return row + col;
}

function buildSnakeOrderToIndexMap3(): number[] {
  const pathOrder = new Array<number>(CELLS);
  const key = (row: number, col: number) => rowMajorIndex3(row, col);
  let t = 0;
  for (let row = 0; row < N; row += 1) {
    if (row % 2 === 0) {
      for (let col = 0; col < N; col += 1) {
        pathOrder[key(row, col)] = t;
        t += 1;
      }
    } else {
      for (let col = N - 1; col >= 0; col -= 1) {
        pathOrder[key(row, col)] = t;
        t += 1;
      }
    }
  }
  return pathOrder;
}

const SNAKE_ORDER_3: readonly number[] = buildSnakeOrderToIndexMap3();

export function snakePath3NormFromIndex(index: number): number {
  return SNAKE_ORDER_3[index]! / (CELLS - 1);
}

export function snakePath3OrderValue(index: number): number {
  return SNAKE_ORDER_3[index]!;
}

function buildSpiralInwardOrderToIndexMap3(): number[] {
  const order = new Array<number>(CELLS);
  let top = 0;
  let bottom = N - 1;
  let left = 0;
  let right = N - 1;
  let t = 0;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col += 1) {
      order[rowMajorIndex3(top, col)] = t;
      t += 1;
    }

    for (let row = top + 1; row <= bottom; row += 1) {
      order[rowMajorIndex3(row, right)] = t;
      t += 1;
    }

    if (top < bottom) {
      for (let col = right - 1; col >= left; col -= 1) {
        order[rowMajorIndex3(bottom, col)] = t;
        t += 1;
      }
    }

    if (left < right) {
      for (let row = bottom - 1; row > top; row -= 1) {
        order[rowMajorIndex3(row, left)] = t;
        t += 1;
      }
    }

    top += 1;
    bottom -= 1;
    left += 1;
    right -= 1;
  }

  return order;
}

const SPIRAL_INWARD_ORDER_3: readonly number[] = buildSpiralInwardOrderToIndexMap3();

export function spiralInward3NormFromIndex(index: number): number {
  return SPIRAL_INWARD_ORDER_3[index]! / (CELLS - 1);
}

export function spiralInward3OrderValue(index: number): number {
  return SPIRAL_INWARD_ORDER_3[index]!;
}

function buildOuterRingClockwiseOrder3(): number[] {
  const order = new Array<number>(CELLS).fill(-1);
  const path: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [2, 1],
    [2, 0],
    [1, 0]
  ];

  path.forEach(([row, col], step) => {
    order[rowMajorIndex3(row, col)] = step;
  });

  return order;
}

const OUTER_RING_CLOCKWISE_ORDER_3: readonly number[] = buildOuterRingClockwiseOrder3();

export function outerRingClockwise3OrderValue(index: number): number {
  return OUTER_RING_CLOCKWISE_ORDER_3[index]!;
}

export function outerRingClockwise3NormFromIndex(index: number): number {
  const order = OUTER_RING_CLOCKWISE_ORDER_3[index]!;
  if (order < 0) {
    return 0;
  }
  return order / 7;
}

export function isCenterCell3(row: number, col: number): boolean {
  const center = Math.floor(N / 2);
  return row === center && col === center;
}

export function rowWave3NormFromRow(row: number): number {
  return row / (N - 1);
}

export function colWave3NormFromCol(col: number): number {
  return col / (N - 1);
}

export function colWave3NormFromColReverse(col: number): number {
  return (N - 1 - col) / (N - 1);
}

/** Triplet blend for path-position idle previews — base → mid → peak. */
export function wave3PathOpacityFromNorm(
  norm: number,
  base = 0.06,
  mid = 0.38,
  peak = 0.88
): number {
  const t = Math.min(1, Math.max(0, norm));
  if (t <= 0.5) {
    return base + (t / 0.5) * (mid - base);
  }
  return mid + ((t - 0.5) / 0.5) * (peak - mid);
}
