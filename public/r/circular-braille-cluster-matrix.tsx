"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularBrailleClusterMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 24;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.34;
const HIGH_OPACITY = 0.95;

const BRAILLE_PHASES: ReadonlyArray<ReadonlySet<string>> = [
  new Set(["1,1", "2,1", "3,1", "1,3", "2,3", "3,3"]), // rails
  new Set(["1,1", "2,1", "3,1", "2,2", "1,3", "2,3", "3,3"]), // center bridge
  new Set(["1,1", "1,2", "1,3", "2,1", "2,3", "3,1", "3,2", "3,3"]), // top+bottom bars
  new Set(["1,1", "3,1", "2,2", "1,3", "3,3"]), // X-cross
  new Set(["2,1", "1,2", "3,2", "2,3"]), // plus motif
  new Set(["1,1", "2,1", "2,2", "2,3", "3,3"]) // diagonal sweep
];

export function CircularBrailleClusterMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBrailleClusterMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1680,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const ring = Math.sqrt(x * x + y * y);
      const phaseIndex =
        reducedMotion || phase === "idle"
          ? 0
          : Math.floor((animPhase) * BRAILLE_PHASES.length) % BRAILLE_PHASES.length;
      const activePattern = BRAILLE_PHASES[phaseIndex]!;
      const key = `${row},${col}`;
      const inPattern = activePattern.has(key);

      const previousIndex = (phaseIndex + BRAILLE_PHASES.length - 1) % BRAILLE_PHASES.length;
      const inPrevPattern = BRAILLE_PHASES[previousIndex]!.has(key);

      let opacity = BASE_OPACITY;
      if (inPattern) {
        opacity = HIGH_OPACITY;
      } else if (inPrevPattern) {
        opacity = MID_OPACITY;
      } else if (ring < 1.1) {
        opacity = 0.2;
      }

      return { style: { opacity } };
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
      animationResolver={resolver}
    />
  );
}
