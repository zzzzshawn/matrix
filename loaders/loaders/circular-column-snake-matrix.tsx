"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularColumnSnakeMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const STRAND_OPACITY = 1;
const NEAR_STRAND_OPACITY = 0.24;
const STEP_COUNT = 20;
const HELIX_LOOP_RADIANS = (Math.PI * 2) / (STEP_COUNT - 1);

export function CircularColumnSnakeMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularColumnSnakeMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1700,
    speed
  });

  const animationResolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const t = reducedMotion || phase === "idle" ? 0 : animPhase * STEP_COUNT;
      const diagonalAxis = row + col;
      const phaseOffset = t * HELIX_LOOP_RADIANS + diagonalAxis * 0.82;
      const strandPerpendicular = Math.round(2 * Math.sin(phaseOffset));
      const cellPerpendicular = col - row;
      const distanceFromStrand = Math.abs(cellPerpendicular - strandPerpendicular);

      if (distanceFromStrand === 0) {
        return { style: { opacity: STRAND_OPACITY } };
      }

      if (distanceFromStrand === 1) {
        return { style: { opacity: NEAR_STRAND_OPACITY } };
      }

      return { style: { opacity: BASE_OPACITY } };
    };
  }, [reducedMotion, animPhase]);

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern="full"
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
