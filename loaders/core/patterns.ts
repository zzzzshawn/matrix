import type { MatrixPattern } from "../types";

export const MATRIX_SIZE = 5;

const CENTER = Math.floor(MATRIX_SIZE / 2);

const RANGE = [...Array(MATRIX_SIZE).keys()];

export const FULL_INDEXES = RANGE.flatMap((row) =>
  RANGE.map((col) => rowMajorIndex(row, col))
);

export const DIAMOND_INDEXES = FULL_INDEXES.filter((index) => {
  const { row, col } = indexToCoord(index);
  return Math.abs(row - CENTER) + Math.abs(col - CENTER) <= 2;
});

export const OUTLINE_INDEXES = FULL_INDEXES.filter((index) => {
  const { row, col } = indexToCoord(index);
  return row === 0 || row === MATRIX_SIZE - 1 || col === 0 || col === MATRIX_SIZE - 1;
});

export const CROSS_INDEXES = FULL_INDEXES.filter((index) => {
  const { row, col } = indexToCoord(index);
  return row === CENTER || col === CENTER;
});

export const RINGS_INDEXES = FULL_INDEXES.filter((index) => {
  const { row, col } = indexToCoord(index);
  const radius = Math.hypot(row - CENTER, col - CENTER);
  return Math.round(radius) === 1 || Math.round(radius) === 2;
});

export const ROSE_INDEXES = FULL_INDEXES.filter((index) => {
  const { row, col } = indexToCoord(index);
  const dx = col - CENTER;
  const dy = row - CENTER;
  const angle = Math.atan2(dy, dx);
  const radius = Math.hypot(dx, dy);
  const rose = Math.abs(Math.sin(3 * angle));
  return rose > 0.6 && radius >= 1;
});

const PATTERN_INDEXES: Record<MatrixPattern, number[]> = {
  diamond: DIAMOND_INDEXES,
  full: FULL_INDEXES,
  outline: OUTLINE_INDEXES,
  rose: ROSE_INDEXES,
  cross: CROSS_INDEXES,
  rings: RINGS_INDEXES
};

export function getPatternIndexes(pattern: MatrixPattern = "diamond"): number[] {
  return PATTERN_INDEXES[pattern];
}

export function rowMajorIndex(row: number, col: number): number {
  return row * MATRIX_SIZE + col;
}

export function indexToCoord(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / MATRIX_SIZE),
    col: index % MATRIX_SIZE
  };
}

export function distanceFromCenter(index: number): number {
  const { row, col } = indexToCoord(index);
  return Math.hypot(row - CENTER, col - CENTER);
}

export function rowDistance(index: number): number {
  const { row } = indexToCoord(index);
  return Math.abs(row - CENTER);
}
