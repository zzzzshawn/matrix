"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularDnaRungShiftMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 30;
const BASE_OPACITY = 0.07;
const RUNG_OPACITY = 0.95;
const SIDE_OPACITY = 0.56;
const GHOST_OPACITY = 0.28;

export function CircularDnaRungShiftMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularDnaRungShiftMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1650,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const phaseStep = reducedMotion || phase === "idle" ? 0 : Math.floor((animPhase) * 10);
      const activeRow = (phaseStep + 5) % 5;
      const rowDistance = Math.abs(row - activeRow);
      const swing = Math.sin((phaseStep / 10) * Math.PI * 2 + y * 0.9);
      const leftAnchor = Math.round(1 + swing);
      const rightAnchor = 4 - leftAnchor;

      let opacity = BASE_OPACITY;
      if (row === activeRow && col >= leftAnchor && col <= rightAnchor) {
        opacity = RUNG_OPACITY;
      } else if ((col === leftAnchor || col === rightAnchor) && rowDistance <= 1) {
        opacity = SIDE_OPACITY;
      } else if ((col === leftAnchor || col === rightAnchor) && rowDistance === 2) {
        opacity = GHOST_OPACITY;
      }

      if (x === 0 && y === 0 && rowDistance <= 1) {
        return { style: { opacity: Math.max(opacity, SIDE_OPACITY) } };
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
