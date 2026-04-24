const CORNER_COORDS = new Set(["0,0", "0,4", "4,0", "4,4"]);

export function isWithinCircularMask(row: number, col: number): boolean {
  return !CORNER_COORDS.has(`${row},${col}`);
}
