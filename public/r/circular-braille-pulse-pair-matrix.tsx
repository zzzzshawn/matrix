"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularBraillePulsePairMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.33;
const HIGH_OPACITY = 0.95;

export function CircularBraillePulsePairMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBraillePulsePairMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1550,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const t = reducedMotion || phase === "idle" ? 0 : Math.floor((animPhase) * 6);
      const pulseRow = t % 3; // 0..2
      const topRow = pulseRow;
      const bottomRow = 4 - pulseRow;
      const pairCols = [1, 3];

      let opacity = BASE_OPACITY;
      if ((row === topRow || row === bottomRow) && pairCols.includes(col)) {
        opacity = HIGH_OPACITY;
      } else if ((row === topRow || row === bottomRow) && col === 2) {
        opacity = 0.58;
      } else if ((row === 2 || col === 2) && pairCols.includes(col) === false) {
        opacity = MID_OPACITY;
      } else if (pairCols.includes(col)) {
        opacity = 0.22;
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
