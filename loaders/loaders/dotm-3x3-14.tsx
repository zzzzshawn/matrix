"use client";

import { useMemo } from "react";

import { DotMatrix3Base } from "../base/dot-matrix-3-base";
import { useDotMatrixPhases } from "../core/phases";
import { isCenterCell3, outerRingClockwise3OrderValue } from "../core/grid-paths-3";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import { useSteppedCycle } from "../hooks/use-stepped-cycle";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type Dotm3x3_14Props = DotMatrixCommonProps;

const BASE_OPACITY = 0.06;
const TAIL_LEVELS = [0.92, 0.52, 0.24] as const;
const PERIMETER = 8;

export function Dotm3x3_14({
  speed = 1.6,
  pattern = "full",
  dotShape = "circle",
  animated = true,
  hoverAnimated = false,
  ...rest
}: Dotm3x3_14Props) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed
  });
  const step = useSteppedCycle({
    active: !reducedMotion && matrixPhase !== "idle",
    cycleMsBase: 1150,
    steps: PERIMETER,
    speed
  });

  const animationResolver = useMemo<DotAnimationResolver>(() => {
    const head = step % PERIMETER;

    return ({ isActive, index, row, col, reducedMotion: rm, phase }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      if (isCenterCell3(row, col)) {
        const opacity = rm || phase === "idle" ? 0.18 : 0.1 + (head % 2) * 0.08;
        return { style: { opacity } };
      }

      const order = outerRingClockwise3OrderValue(index);
      if (order < 0) {
        return { style: { opacity: BASE_OPACITY } };
      }

      const trail = (head - order + PERIMETER) % PERIMETER;
      let opacity = BASE_OPACITY;
      for (let i = 0; i < TAIL_LEVELS.length; i += 1) {
        if (trail === i) {
          opacity = BASE_OPACITY + TAIL_LEVELS[i]! * 0.82;
          break;
        }
      }

      if (rm || phase === "idle") {
        return { style: { opacity } };
      }

      return { style: { opacity } };
    };
  }, [step]);

  return (
    <DotMatrix3Base
      {...rest}
      speed={speed}
      pattern={pattern}
      dotShape={dotShape}
      animated={animated}
      phase={matrixPhase}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
