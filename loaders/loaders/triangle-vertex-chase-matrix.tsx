"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { cx } from "../core/cx";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotMatrixCommonProps } from "../types";

export type TriangleVertexChaseMatrixProps = DotMatrixCommonProps;

const MATRIX_SIZE = 7;
const STEP_COUNT = 28;
const BASE_OPACITY = 0.0;
const MID_OPACITY = 0.0;
const HIGH_OPACITY = 0.96;
const TRAIL_LEVELS = [HIGH_OPACITY, 0.52, 0.3] as const;

const TRIANGLE_CELLS = new Set([
  "1,3",
  "2,2",
  "2,4",
  "3,1",
  "3,3",
  "3,5",
  "4,0",
  "4,2",
  "4,4",
  "4,6"
]);

const PERIMETER_PATH: ReadonlyArray<readonly [number, number]> = [
  [1, 3],
  [2, 2],
  [3, 1],
  [4, 0],
  [4, 2],
  [4, 4],
  [4, 6],
  [3, 5],
  [2, 4]
];

function isWithinTriangleMask(row: number, col: number): boolean {
  if (row < 0 || row >= MATRIX_SIZE || col < 0 || col >= MATRIX_SIZE) {
    return false;
  }

  return TRIANGLE_CELLS.has(`${row},${col}`);
}

export function TriangleVertexChaseMatrix({
  size = 30,
  dotSize = 4,
  color = "currentColor",
  ariaLabel = "Loading",
  className,
  muted = false,
  dotClassName,
  speed = 1,
  animated = true,
  hoverAnimated = false
}: TriangleVertexChaseMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1550 / safeSpeed;
    const stepMs = Math.max(18, Math.round(cycleMs / STEP_COUNT));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STEP_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const frame = reducedMotion || !animated || hoverAnimated ? 0 : step;
  const segmentLength = Math.max(1, Math.floor(STEP_COUNT / 3));

  const gap = Math.max(1, Math.floor((size - dotSize * MATRIX_SIZE) / (MATRIX_SIZE - 1)));
  const rootStyle = {
    width: size,
    height: size,
    color
  } as CSSProperties;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cx("dmx-root", muted && "dmx-muted", className)}
      style={rootStyle}
    >
      <div
        className="dmx-grid"
        style={{
          gap,
          gridTemplateColumns: `repeat(${MATRIX_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MATRIX_SIZE}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }).map((_, index) => {
          const row = Math.floor(index / MATRIX_SIZE);
          const col = index % MATRIX_SIZE;
          const isActive = isWithinTriangleMask(row, col);

          let opacity = 0;
          if (isActive) {
            opacity = row === 3 && col === 3 ? MID_OPACITY : BASE_OPACITY;

            for (let headOffset = 0; headOffset < 3; headOffset += 1) {
              const spokeFrame = (frame + headOffset * segmentLength) % STEP_COUNT;
              const head = Math.floor((spokeFrame / STEP_COUNT) * PERIMETER_PATH.length);

              for (let trail = 0; trail < TRAIL_LEVELS.length; trail += 1) {
                const idx = (head - trail + PERIMETER_PATH.length) % PERIMETER_PATH.length;
                const [pathRow, pathCol] = PERIMETER_PATH[idx]!;
                if (row === pathRow && col === pathCol) {
                  opacity = Math.max(opacity, TRAIL_LEVELS[trail]!);
                  break;
                }
              }
            }
          }

          return (
            <span
              key={index}
              aria-hidden="true"
              className={cx("dmx-dot", !isActive && "dmx-inactive", dotClassName)}
              style={{
                width: dotSize,
                height: dotSize,
                opacity
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
