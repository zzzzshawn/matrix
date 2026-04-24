"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularDnaTwinHelixMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 28;
const BASE_OPACITY = 0.07;
const STRAND_OPACITY = 0.95;
const NEAR_STRAND_OPACITY = 0.5;
const BRIDGE_OPACITY = 0.3;

export function CircularDnaTwinHelixMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularDnaTwinHelixMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1750 / safeSpeed;
    const stepMs = Math.max(20, Math.round(cycleMs / STEP_COUNT));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STEP_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const x = col - 2;
      const y = row - 2;
      const t = reducedMotion || phase === "idle" ? 0 : (step / STEP_COUNT) * Math.PI * 2;

      const strandOffset = Math.sin(y * 1.35 + t * 1.3) * 1.15;
      const leftStrand = -strandOffset;
      const rightStrand = strandOffset;
      const leftDistance = Math.abs(x - leftStrand);
      const rightDistance = Math.abs(x - rightStrand);
      const strandDistance = Math.min(leftDistance, rightDistance);
      const bridgeOn = Math.cos(y * 2 + t * 2.1) > 0.55;
      const isBetweenStrands = x > Math.min(leftStrand, rightStrand) && x < Math.max(leftStrand, rightStrand);

      let opacity = BASE_OPACITY;
      if (strandDistance < 0.34) {
        opacity = STRAND_OPACITY;
      } else if (strandDistance < 0.8) {
        opacity = NEAR_STRAND_OPACITY;
      } else if (bridgeOn && isBetweenStrands) {
        opacity = BRIDGE_OPACITY;
      }

      return { style: { opacity } };
    };
  }, [reducedMotion, step]);

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
