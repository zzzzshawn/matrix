"use client";

import { useMemo, useRef } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularBrailleCheckerShiftMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.34;
const HIGH_OPACITY = 0.95;
/** Discrete checker frames per loop (must stay integer for `(row + col + t) % 2`). */
const CHECKER_STEPS = 4;

export function CircularBrailleCheckerShiftMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBrailleCheckerShiftMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1500,
    speed
  });

  const animPhaseRef = useRef(animPhase);
  animPhaseRef.current = animPhase;

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase: matrixPhase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const holdStill = reducedMotion || matrixPhase === "idle";
      const t = holdStill
        ? 0
        : Math.floor(animPhaseRef.current * CHECKER_STEPS) % CHECKER_STEPS;
      const parity = (row + col + t) % 2;
      const brailleBias = col === 1 || col === 3;
      const centerBias = row === 2 || col === 2;

      let opacity = BASE_OPACITY;
      if (parity === 0 && brailleBias) {
        opacity = HIGH_OPACITY;
      } else if (parity === 0 || centerBias) {
        opacity = MID_OPACITY;
      } else if (brailleBias) {
        opacity = 0.24;
      }

      return { style: { opacity } };
    };
  }, [reducedMotion]);

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern="full"
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={resolver}
    />
  );
}
