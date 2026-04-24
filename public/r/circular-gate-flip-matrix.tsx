"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularGateFlipMatrixProps = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const GATE_OPACITY = 0.92;

export function CircularGateFlipMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularGateFlipMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const phase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1600,
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
      const ring = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);

      const petalWave = 0.5 + 0.5 * Math.cos(5 * angle - t * 1.7);
      const ringWave = 0.5 + 0.5 * Math.cos(ring * 3.3 - t * 1.2);
      const chordWave = 0.5 + 0.5 * Math.cos((x + y) * 1.6 + t * 1.35);

      // Sharpen contrast so lit cells form clear, visible groups.
      const petalGate = Math.pow(petalWave, 2.2);
      const blend = 0.68 * petalGate + 0.22 * ringWave + 0.1 * chordWave;
      const opacity = BASE_OPACITY + (GATE_OPACITY - BASE_OPACITY) * blend;

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
