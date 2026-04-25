"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularBinaryBloomMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 30;
const BASE_OPACITY = 0.06;
const LOW_OPACITY = 0.2;
const MID_OPACITY = 0.48;
const HIGH_OPACITY = 0.94;

function moduloDistance(a: number, b: number, mod: number): number {
  const raw = Math.abs(a - b);
  return Math.min(raw, mod - raw);
}

export function CircularBinaryBloomMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBinaryBloomMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1600,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const ring = Math.round(Math.sqrt(x * x + y * y));
      const tick = reducedMotion || phase === "idle" ? 0 : Math.floor((animPhase) * 10);
      const cellCode = (row * 3 + col * 5 + ring * 2) % 10;
      const d = moduloDistance(cellCode, tick, 10);
      const parityGate = (row + col + tick) % 2 === 0;

      let opacity = BASE_OPACITY;
      if (d === 0) {
        opacity = HIGH_OPACITY;
      } else if (d === 1) {
        opacity = MID_OPACITY;
      } else if (d === 2 || parityGate) {
        opacity = LOW_OPACITY;
      }

      if (x === 0 && y === 0) {
        return { style: { opacity: Math.max(opacity, MID_OPACITY) } };
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
