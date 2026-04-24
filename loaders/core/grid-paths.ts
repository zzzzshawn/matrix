import { indexToCoord, MATRIX_SIZE, rowMajorIndex } from "./patterns";

const N = MATRIX_SIZE;
const C = Math.floor(MATRIX_SIZE / 2);
const CELLS = N * N;

const MAX_TRBL = (N - 1) * 2;

/** Wavefront travels from top-right toward bottom-left: anti-diagonal with row and (1-col) both increasing. */
export function trBlPathNormFromIndex(index: number): number {
  const { row, col } = indexToCoord(index);
  return (row + (N - 1 - col)) / MAX_TRBL;
}

function buildSnakeOrderToIndexMap(): number[] {
  const pathOrder = new Array<number>(CELLS);
  const key = (row: number, col: number) => rowMajorIndex(row, col);
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

const SNAKE_ORDER: readonly number[] = buildSnakeOrderToIndexMap();

export function snakePathNormFromIndex(index: number): number {
  return SNAKE_ORDER[index]! / (CELLS - 1);
}

/**
 * Boustrophedon-order indices (0 = top-left, 24 = … end of serpentine path) as in {@link SNAKE_ORDER}
 * order value, for testing or other loaders.
 */
export function snakePathOrderValue(index: number): number {
  return SNAKE_ORDER[index]!;
}

function buildSpiralInwardOrderToIndexMap(): number[] {
  const order = new Array<number>(CELLS);
  let top = 0;
  let bottom = N - 1;
  let left = 0;
  let right = N - 1;
  let t = 0;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col += 1) {
      order[rowMajorIndex(top, col)] = t;
      t += 1;
    }

    for (let row = top + 1; row <= bottom; row += 1) {
      order[rowMajorIndex(row, right)] = t;
      t += 1;
    }

    if (top < bottom) {
      for (let col = right - 1; col >= left; col -= 1) {
        order[rowMajorIndex(bottom, col)] = t;
        t += 1;
      }
    }

    if (left < right) {
      for (let row = bottom - 1; row > top; row -= 1) {
        order[rowMajorIndex(row, left)] = t;
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

const SPIRAL_INWARD_ORDER: readonly number[] = buildSpiralInwardOrderToIndexMap();

export function spiralInwardNormFromIndex(index: number): number {
  return SPIRAL_INWARD_ORDER[index]! / (CELLS - 1);
}

export function spiralInwardOrderValue(index: number): number {
  return SPIRAL_INWARD_ORDER[index]!;
}

function buildOuterRingClockwiseOrderToIndexMap(): number[] {
  const order = new Array<number>(CELLS).fill(-1);
  const coords: Array<[number, number]> = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 3],
    [4, 2],
    [4, 1],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0]
  ];

  for (let t = 0; t < coords.length; t += 1) {
    const [row, col] = coords[t]!;
    order[rowMajorIndex(row, col)] = t;
  }

  return order;
}

function buildMiddleRingAntiClockwiseOrderToIndexMap(): number[] {
  const order = new Array<number>(CELLS).fill(-1);
  const coords: Array<[number, number]> = [
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [3, 3],
    [2, 3],
    [1, 3],
    [1, 2]
  ];

  for (let t = 0; t < coords.length; t += 1) {
    const [row, col] = coords[t]!;
    order[rowMajorIndex(row, col)] = t;
  }

  return order;
}

const OUTER_RING_CLOCKWISE_ORDER: readonly number[] = buildOuterRingClockwiseOrderToIndexMap();
const MIDDLE_RING_ANTI_CLOCKWISE_ORDER: readonly number[] = buildMiddleRingAntiClockwiseOrderToIndexMap();

export function outerRingClockwiseOrderValue(index: number): number {
  return OUTER_RING_CLOCKWISE_ORDER[index]!;
}

export function outerRingClockwiseNormFromIndex(index: number): number {
  const order = outerRingClockwiseOrderValue(index);
  return order >= 0 ? order / 15 : 0;
}

export function middleRingAntiClockwiseOrderValue(index: number): number {
  return MIDDLE_RING_ANTI_CLOCKWISE_ORDER[index]!;
}

export function middleRingAntiClockwiseNormFromIndex(index: number): number {
  const order = middleRingAntiClockwiseOrderValue(index);
  return order >= 0 ? order / 7 : 0;
}

function buildDiagonalSnakeOrderToIndexMap(): number[] {
  const order = new Array<number>(CELLS);
  let t = 0;

  for (let diagonal = 0; diagonal <= (N - 1) * 2; diagonal += 1) {
    const rowStart = Math.max(0, diagonal - (N - 1));
    const rowEnd = Math.min(N - 1, diagonal);

    if (diagonal % 2 === 0) {
      for (let row = rowEnd; row >= rowStart; row -= 1) {
        const col = diagonal - row;
        order[rowMajorIndex(row, col)] = t;
        t += 1;
      }
    } else {
      for (let row = rowStart; row <= rowEnd; row += 1) {
        const col = diagonal - row;
        order[rowMajorIndex(row, col)] = t;
        t += 1;
      }
    }
  }

  return order;
}

const DIAGONAL_SNAKE_ORDER: readonly number[] = buildDiagonalSnakeOrderToIndexMap();

export function diagonalSnakeOrderValue(index: number): number {
  return DIAGONAL_SNAKE_ORDER[index]!;
}

export function diagonalSnakeNormFromIndex(index: number): number {
  return DIAGONAL_SNAKE_ORDER[index]! / (CELLS - 1);
}

function buildRowWaveSnakeOrderToIndexMap(): number[] {
  const order = new Array<number>(CELLS);
  const route: Array<{ col: number; dir: "up" | "down" }> = [
    { col: 0, dir: "up" },
    { col: 2, dir: "down" },
    { col: 1, dir: "up" },
    { col: 3, dir: "down" },
    { col: 2, dir: "up" },
    { col: 4, dir: "down" }
  ];

  let t = 0;
  for (const step of route) {
    if (step.dir === "up") {
      for (let row = N - 1; row >= 0; row -= 1) {
        order[rowMajorIndex(row, step.col)] = t;
        t += 1;
      }
    } else {
      for (let row = 0; row < N; row += 1) {
        order[rowMajorIndex(row, step.col)] = t;
        t += 1;
      }
    }
  }

  return order;
}

const ROW_WAVE_SNAKE_ORDER: readonly number[] = buildRowWaveSnakeOrderToIndexMap();
const ROW_WAVE_SNAKE_MAX_ORDER = Math.max(...ROW_WAVE_SNAKE_ORDER);

export function rowWaveOrderValue(index: number): number {
  return ROW_WAVE_SNAKE_ORDER[index]!;
}

export function rowWaveNormFromIndex(index: number): number {
  return ROW_WAVE_SNAKE_MAX_ORDER > 0 ? rowWaveOrderValue(index) / ROW_WAVE_SNAKE_MAX_ORDER : 0;
}

export function colWaveNormFromIndex(index: number): number {
  const { col } = indexToCoord(index);
  return N > 1 ? col / (N - 1) : 0;
}

/** Chebyshev “rings” from center, matching square halftone concentric feel. */
export function concentricRingNormFromIndex(index: number): number {
  const { row, col } = indexToCoord(index);
  return Math.max(Math.abs(row - C), Math.abs(col - C)) / C;
}
