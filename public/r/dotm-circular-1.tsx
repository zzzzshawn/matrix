"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "@/components/ui/dotmatrix-core";
import { useDotMatrixPhases } from "@/components/ui/dotmatrix-hooks";
import { isWithinCircularMask } from "@/components/ui/dotmatrix-core";
import { useCyclePhase } from "@/components/ui/dotmatrix-hooks";
import { usePrefersReducedMotion } from "@/components/ui/dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "@/components/ui/dotmatrix-core";

export type DotmCircular1Props = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const STRAND_OPACITY = 1;
const NEAR_STRAND_OPACITY = 0.24;
const STEP_COUNT = 20;
const HELIX_LOOP_RADIANS = (Math.PI * 2) / (STEP_COUNT - 1);

export function DotmCircular1({
  speed = 2.5,
  animated = true,
  hoverAnimated = false,
  ...rest
}: DotmCircular1Props) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed
  });
  const animPhase = useCyclePhase({
    active: !reducedMotion && matrixPhase !== "idle",
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
      size={rest.size ?? 36}
      dotSize={rest.dotSize ?? 5}
      speed={speed}
      pattern="full"
      animated={animated}
      phase={matrixPhase}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
