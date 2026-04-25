"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { cx } from "./dotmatrix-core";
import { styleOpacity, stylePx } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotMatrixCommonProps } from "./dotmatrix-core";

export type TriangleRowScanMatrixProps = DotMatrixCommonProps;

const MATRIX_SIZE = 7;
const STEP_COUNT = 42;
const BASE_OPACITY = 0.06;
const MID_OPACITY = 0.3;
const HIGH_OPACITY = 0.92;

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

function isWithinTriangleMask(row: number, col: number): boolean {
  if (row < 0 || row >= MATRIX_SIZE || col < 0 || col >= MATRIX_SIZE) {
    return false;
  }

  return TRIANGLE_CELLS.has(`${row},${col}`);
}

export function TriangleRowScanMatrix({
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
}: TriangleRowScanMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1700 / safeSpeed;
    const stepMs = Math.max(20, Math.round(cycleMs / STEP_COUNT));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STEP_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const frame = reducedMotion || !animated || hoverAnimated ? 0 : step;
  const progress = frame / STEP_COUNT;
  const pingPong = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
  const scanRow = 1 + pingPong * 3;

  const gap = Math.max(1, Math.floor((size - dotSize * MATRIX_SIZE) / (MATRIX_SIZE - 1)));
  const rootStyle = {
    width: stylePx(size),
    height: stylePx(size),
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
            const distance = Math.abs(row - scanRow);
            const beam = Math.max(0, 1 - distance / 2.2);
            const easedBeam = beam * beam;
            opacity = BASE_OPACITY + easedBeam * (HIGH_OPACITY - BASE_OPACITY);

            if (distance > 1.3) {
              opacity = Math.max(opacity, MID_OPACITY - Math.min(0.18, (distance - 1.3) * 0.12));
            }

            // Keep the center consistently readable while rows scan.
            if (row === 3 && col === 3) {
              opacity = Math.max(opacity, 0.42);
            }
          }

          return (
            <span
              key={index}
              aria-hidden="true"
              className={cx("dmx-dot", !isActive && "dmx-inactive", dotClassName)}
              style={{
                width: stylePx(dotSize),
                height: stylePx(dotSize),
                opacity: styleOpacity(opacity)
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
