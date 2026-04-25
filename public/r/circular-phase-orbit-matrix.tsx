"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularPhaseOrbitMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const ORBIT_OPACITY = 0.96;
const NEAR_ORBIT_OPACITY = 0.34;

export function CircularPhaseOrbitMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularPhaseOrbitMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const phase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1700,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase: p }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const t = reducedMotion || p === "idle" ? 0 : (phase) * Math.PI * 2;
      const angle = Math.atan2(y, x);
      const ring = Math.sqrt(x * x + y * y);

      const angularPhase = ((angle - t * 0.95 + Math.PI * 4) % (Math.PI * 2)) / ((Math.PI * 2) / 3);
      const sectorPos = angularPhase - Math.floor(angularPhase);
      const sectorPulse = Math.max(0, 1 - Math.abs(sectorPos - 0.5) * 2);
      const ringPhase = 0.5 + 0.5 * Math.cos(ring * 3.2 + t * 1.7);
      const score = 0.74 * sectorPulse + 0.26 * ringPhase;

      let opacity = BASE_OPACITY;
      if (score > 0.84) {
        opacity = ORBIT_OPACITY;
      } else if (score > 0.63) {
        opacity = 0.62;
      } else if (score > 0.44) {
        opacity = NEAR_ORBIT_OPACITY;
      }

      if (x === 0 && y === 0) {
        return { style: { opacity: Math.max(opacity, NEAR_ORBIT_OPACITY) } };
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
