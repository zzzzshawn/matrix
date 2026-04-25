"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularQuadrantBreatheMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.3;
const HIGH_OPACITY = 0.95;

export function CircularQuadrantBreatheMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularQuadrantBreatheMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const phase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1850,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase: p }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const ring = Math.sqrt(x * x + y * y);
      const t = reducedMotion || p === "idle" ? 0 : (phase) * Math.PI * 2;
      const angle = Math.atan2(y, x);
      const moonCenterX = Math.cos(t) * 0.7;
      const moonCenterY = Math.sin(t) * 0.7;
      const body = Math.hypot(x - moonCenterX, y - moonCenterY);
      const cutCenterX = moonCenterX + Math.cos(t) * 0.82;
      const cutCenterY = moonCenterY + Math.sin(t) * 0.82;
      const cut = Math.hypot(x - cutCenterX, y - cutCenterY);
      const rim = Math.max(0, 1 - Math.abs(body - 1.55) / 0.35);
      const halo = Math.max(0, 1 - Math.acos(Math.cos(angle - t)) / 0.9);

      let opacity = BASE_OPACITY;
      if (body < 1.55 && cut > 1.05) {
        opacity = HIGH_OPACITY;
      } else if (rim > 0.5) {
        opacity = MID_OPACITY + rim * 0.22;
      } else if (halo > 0.68 && ring > 1.2) {
        opacity = MID_OPACITY;
      }

      return { style: { opacity: Math.min(HIGH_OPACITY, opacity) } };
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
