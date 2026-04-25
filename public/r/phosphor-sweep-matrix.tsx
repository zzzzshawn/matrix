"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { MATRIX_SIZE } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type PhosphorSweepMatrixProps = DotMatrixCommonProps;

const ROWS = MATRIX_SIZE;

const BASE_OPACITY = 0.08;
const PEAK_OPACITY = 1;
const DECAY = 0.72;
const COL_WARP = 0.07;

export function PhosphorSweepMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: PhosphorSweepMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [scanRow, setScanRow] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setScanRow(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const sweepMs = 1500 / safeSpeed;
    const stepMs = Math.max(40, Math.round(sweepMs / ROWS));
    const timer = window.setInterval(() => {
      setScanRow((prev) => (prev + 1) % ROWS);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ isActive, row, col, phase }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      if (reducedMotion || phase === "idle") {
        const falloff = (ROWS - 1 - row) / Math.max(1, ROWS - 1);
        return { style: { opacity: BASE_OPACITY + falloff * 0.38 } };
      }

      const colGain = 1 + COL_WARP * Math.sin(col * 1.72 + scanRow * 0.61);

      if (row > scanRow) {
        return { style: { opacity: BASE_OPACITY } };
      }

      const age = scanRow - row;
      const trail = Math.exp(-age * DECAY);
      const opacity = BASE_OPACITY + (PEAK_OPACITY - BASE_OPACITY) * trail * colGain;

      return { style: { opacity: Math.min(PEAK_OPACITY, opacity) } };
    };
  }, [reducedMotion, scanRow]);

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern={pattern}
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={resolver}
    />
  );
}
