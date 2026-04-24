"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { cx } from "../core/cx";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotMatrixCommonProps } from "../types";

export type TriangleApexBeaconMatrixProps = DotMatrixCommonProps;

const MATRIX_SIZE = 7;
const STEP_COUNT = 32;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.32;
const HIGH_OPACITY = 0.95;

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

export function TriangleApexBeaconMatrix({
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
}: TriangleApexBeaconMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1600 / safeSpeed;
    const stepMs = Math.max(18, Math.round(cycleMs / STEP_COUNT));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STEP_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const frame = reducedMotion || !animated || hoverAnimated ? 0 : step;
  const t = (frame / STEP_COUNT) * Math.PI * 2;

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
            const depth = row - 1;
            const phaseLag = depth * 0.22;
            const local = 0.5 - 0.5 * Math.cos(t + phaseLag);
            const crest = local * local;
            const apexBoost = row === 1 && col === 3 ? 0.28 : 0;
            opacity =
              BASE_OPACITY +
              local * (MID_OPACITY - BASE_OPACITY) +
              crest * (HIGH_OPACITY - MID_OPACITY) * (1 - depth * 0.12) +
              apexBoost;
            opacity = Math.min(HIGH_OPACITY, opacity);
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
