"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularBrailleOrbitCellsMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 24;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.34;
const HIGH_OPACITY = 0.95;

const ORBIT_POINTS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [3, 2],
  [3, 1],
  [2, 1]
];

export function CircularBrailleOrbitCellsMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBrailleOrbitCellsMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const phase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1680,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase: p }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const t =
        reducedMotion || p === "idle"
          ? 0
          : Math.floor((phase) * ORBIT_POINTS.length) % ORBIT_POINTS.length;
      const [headRow, headCol] = ORBIT_POINTS[t]!;
      const [tailRow, tailCol] = ORBIT_POINTS[(t + ORBIT_POINTS.length - 1) % ORBIT_POINTS.length]!;

      let opacity = BASE_OPACITY;
      if (row === headRow && col === headCol) {
        opacity = HIGH_OPACITY;
      } else if (row === tailRow && col === tailCol) {
        opacity = 0.62;
      } else if ((col === 1 || col === 3) && (row === 1 || row === 2 || row === 3)) {
        opacity = MID_OPACITY;
      } else if (row === 2 && col === 2) {
        opacity = 0.2;
      }

      return { style: { opacity } };
    };
  }, [reducedMotion, phase]);

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
