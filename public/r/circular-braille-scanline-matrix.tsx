"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularBrailleScanlineMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 25;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.32;
const HIGH_OPACITY = 0.95;

export function CircularBrailleScanlineMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBrailleScanlineMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1700,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      // Discrete steps: animPhase is continuous in [0, 1); fractional `t` breaks row === checks.
      const t =
        reducedMotion || phase === "idle" ? 0 : Math.floor(animPhase * STEP_COUNT) % STEP_COUNT;
      const activeRow = t % 5;
      const activeBrailleCol = Math.floor((t / 5) * 2) % 2; // left or right cell rail
      const railCol = activeBrailleCol === 0 ? 1 : 3;
      const nearCol = activeBrailleCol === 0 ? 2 : 2;
      const rowDistance = Math.abs(row - activeRow);

      let opacity = BASE_OPACITY;
      if (col === railCol && rowDistance === 0) {
        opacity = HIGH_OPACITY;
      } else if (col === railCol && rowDistance === 1) {
        opacity = MID_OPACITY;
      } else if (col === nearCol && rowDistance === 0) {
        opacity = 0.52;
      } else if ((col === 1 || col === 3) && rowDistance === 2) {
        opacity = 0.24;
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
