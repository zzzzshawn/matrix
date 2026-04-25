"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularConstellationMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 36;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.28;
const STAR_OPACITY = 0.96;

export function CircularConstellationMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularConstellationMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1900 / safeSpeed;
    const stepMs = Math.max(18, Math.round(cycleMs / STEP_COUNT));
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
      const ring = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      const t = reducedMotion || phase === "idle" ? 0 : (step / STEP_COUNT) * Math.PI * 2;
      const cardinalCenters = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
      const beaconIndex = Math.floor((step / STEP_COUNT) * cardinalCenters.length) % cardinalCenters.length;
      const activeCenter = cardinalCenters[beaconIndex]!;
      const oppositeCenter = cardinalCenters[(beaconIndex + 2) % cardinalCenters.length]!;

      const distanceToActive = Math.acos(Math.cos(angle - activeCenter));
      const distanceToOpposite = Math.acos(Math.cos(angle - oppositeCenter));
      const activeBeam = Math.max(0, 1 - distanceToActive / 0.5);
      const oppositeBeam = Math.max(0, 1 - distanceToOpposite / 0.65);
      const ringTier = Math.round(ring);

      let opacity = BASE_OPACITY;
      if (activeBeam > 0.8 && ringTier >= 2) {
        opacity = STAR_OPACITY;
      } else if (activeBeam > 0.45 && ringTier >= 1) {
        opacity = 0.62;
      } else if (oppositeBeam > 0.5 && ringTier >= 1) {
        opacity = MID_OPACITY;
      }

      if (x === 0 && y === 0) {
        return { style: { opacity: Math.max(opacity, 0.24) } };
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
