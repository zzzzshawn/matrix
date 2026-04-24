import { indexToCoord, MATRIX_SIZE } from "./patterns";

const CENTER = Math.floor(MATRIX_SIZE / 2);
const MAX_RADIUS = Math.hypot(CENTER, CENTER);

export function polarAngle(index: number): number {
  const { row, col } = indexToCoord(index);
  return Math.atan2(row - CENTER, col - CENTER);
}

export function normalizedRadius(index: number): number {
  const { row, col } = indexToCoord(index);
  return Math.hypot(row - CENTER, col - CENTER) / MAX_RADIUS;
}

export function manhattanDistance(index: number): number {
  const { row, col } = indexToCoord(index);
  return Math.abs(row - CENTER) + Math.abs(col - CENTER);
}

export function harmonicPhase(row: number, col: number, a: number, b: number): number {
  return Math.sin((row + 1) * a + (col + 1) * b);
}

export function lissajousOffset(
  row: number,
  col: number,
  amplitude = 2.25
): { x: number; y: number; phase: number } {
  const x = Math.sin((row + 1) * 1.15 + (col + 1) * 2.2) * amplitude;
  const y = Math.cos((row + 1) * 2.45 + (col + 1) * 0.95) * amplitude;
  const phase = Math.abs(Math.sin((row + 1) * 0.7 + (col + 1) * 1.1));
  return { x, y, phase };
}

export function spiralOffset(
  angle: number,
  radiusNormalizedValue: number,
  amplitude = 2.8
): { x: number; y: number; phase: number } {
  const spin = angle + radiusNormalizedValue * Math.PI * 2.1;
  const radius = radiusNormalizedValue * amplitude;
  const x = Math.cos(spin) * radius;
  const y = Math.sin(spin) * radius;
  const phase = Math.abs(Math.sin(spin * 0.5));
  return { x, y, phase };
}

export function isPrime(value: number): boolean {
  if (value <= 1) {
    return false;
  }
  if (value === 2) {
    return true;
  }
  if (value % 2 === 0) {
    return false;
  }

  const limit = Math.floor(Math.sqrt(value));
  for (let divisor = 3; divisor <= limit; divisor += 2) {
    if (value % divisor === 0) {
      return false;
    }
  }

  return true;
}
