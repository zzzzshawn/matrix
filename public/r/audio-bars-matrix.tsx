"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type AudioBarsMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const LIT_OPACITY = 0.94;
const CAP_OPACITY = 1;
const STEP_COUNT = 24;
const MAX_LEVEL = 5;

function clampLevel(value: number): number {
  return Math.max(1, Math.min(MAX_LEVEL, Math.round(value)));
}

export function AudioBarsMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: AudioBarsMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1750,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ isActive, row, col, phase }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      const t = reducedMotion || phase === "idle" ? 0 : animPhase * STEP_COUNT;
      const colPhase = t * 0.52 + col * 1.15;
      const level = clampLevel(1 + ((Math.sin(colPhase) + 1) / 2) * (MAX_LEVEL - 1));
      const topLitRow = MAX_LEVEL - level;

      if (row > topLitRow) {
        return { style: { opacity: LIT_OPACITY } };
      }
      if (row === topLitRow) {
        return { style: { opacity: CAP_OPACITY } };
      }
      return { style: { opacity: BASE_OPACITY } };
    };
  }, [reducedMotion, animPhase]);

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
