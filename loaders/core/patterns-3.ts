import type { MatrixPattern } from "../types";

export const MATRIX_SIZE_3 = 3;

const CENTER = Math.floor(MATRIX_SIZE_3 / 2);

const RANGE = [...Array(MATRIX_SIZE_3).keys()];

export const FULL_INDEXES_3 = RANGE.flatMap((row) =>
  RANGE.map((col) => rowMajorIndex3(row, col))
);

export const OUTLINE_INDEXES_3 = FULL_INDEXES_3.filter((index) => {
  const { row, col } = indexToCoord3(index);
  return row === 0 || row === MATRIX_SIZE_3 - 1 || col === 0 || col === MATRIX_SIZE_3 - 1;
});

export const DIAMOND_INDEXES_3 = FULL_INDEXES_3.filter((index) => {
  const { row, col } = indexToCoord3(index);
  return Math.abs(row - CENTER) + Math.abs(col - CENTER) <= 1;
});

export const CROSS_INDEXES_3 = FULL_INDEXES_3.filter((index) => {
  const { row, col } = indexToCoord3(index);
  return row === CENTER || col === CENTER;
});

export const RINGS_INDEXES_3 = FULL_INDEXES_3.filter((index) => {
  const { row, col } = indexToCoord3(index);
  return Math.round(Math.hypot(row - CENTER, col - CENTER)) === 1;
});

export const ROSE_INDEXES_3 = FULL_INDEXES_3.filter((index) => {
  const { row, col } = indexToCoord3(index);
  const dx = col - CENTER;
  const dy = row - CENTER;
  const angle = Math.atan2(dy, dx);
  const radius = Math.hypot(dx, dy);
  const rose = Math.abs(Math.sin(3 * angle));
  return rose > 0.55 && radius >= 0.75;
});

const PATTERN_INDEXES_3: Record<MatrixPattern, number[]> = {
  diamond: DIAMOND_INDEXES_3,
  full: FULL_INDEXES_3,
  outline: OUTLINE_INDEXES_3,
  rose: ROSE_INDEXES_3,
  cross: CROSS_INDEXES_3,
  rings: RINGS_INDEXES_3
};

export function getPattern3Indexes(pattern: MatrixPattern = "full"): number[] {
  return PATTERN_INDEXES_3[pattern];
}

export function rowMajorIndex3(row: number, col: number): number {
  return row * MATRIX_SIZE_3 + col;
}

export function indexToCoord3(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / MATRIX_SIZE_3),
    col: index % MATRIX_SIZE_3
  };
}

export function distanceFromCenter3(index: number): number {
  const { row, col } = indexToCoord3(index);
  return Math.hypot(row - CENTER, col - CENTER);
}

export function manhattanDistance3(index: number): number {
  const { row, col } = indexToCoord3(index);
  return Math.abs(row - CENTER) + Math.abs(col - CENTER);
}
