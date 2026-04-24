"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { isWithinCircularMask } from "../core/circle-mask";
import { rowMajorIndex } from "../core/patterns";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CircularMobiusStripMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 24;
const BASE_OPACITY = 0.08;
const RING_BASE_OPACITY = 0.2;
const CORE_OPACITY = 0.16;
const COMET_TAIL = [1, 0.78, 0.56, 0.36, 0.22] as const;
const SECONDARY_COMET_SCALE = 0.72;

const CIRCULAR_RING_PATH: readonly number[] = [
  rowMajorIndex(0, 1),
  rowMajorIndex(0, 2),
  rowMajorIndex(0, 3),
  rowMajorIndex(1, 4),
  rowMajorIndex(2, 4),
  rowMajorIndex(3, 4),
  rowMajorIndex(4, 3),
  rowMajorIndex(4, 2),
  rowMajorIndex(4, 1),
  rowMajorIndex(3, 0),
  rowMajorIndex(2, 0),
  rowMajorIndex(1, 0)
];
const LOOP_LEN = CIRCULAR_RING_PATH.length;

export function CircularMobiusStripMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularMobiusStripMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [headStep, setHeadStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setHeadStep(6);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1650 / safeSpeed;
    const stepMs = Math.max(20, Math.round(cycleMs / STEP_COUNT));
    const timer = window.setInterval(() => {
      setHeadStep((prev) => (prev + 1) % STEP_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ index, row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const pathOrder = CIRCULAR_RING_PATH.indexOf(index);
      const isCore = row === 2 && col === 2;
      if (pathOrder === -1) {
        return { style: { opacity: isCore ? CORE_OPACITY : BASE_OPACITY } };
      }

      if (reducedMotion || phase === "idle") {
        return { style: { opacity: RING_BASE_OPACITY + (pathOrder / (LOOP_LEN - 1)) * 0.56 } };
      }

      const leadA = Math.floor((headStep / STEP_COUNT) * LOOP_LEN) % LOOP_LEN;
      const leadB = (leadA + Math.floor(LOOP_LEN / 2)) % LOOP_LEN;
      let opacity = BASE_OPACITY;

      for (let i = 0; i < COMET_TAIL.length; i += 1) {
        const weight = COMET_TAIL[i] ?? 0;
        const tailA = (leadA - i + LOOP_LEN) % LOOP_LEN;
        const tailB = (leadB - i + LOOP_LEN) % LOOP_LEN;
        if (pathOrder === tailA) {
          opacity = Math.max(opacity, weight);
        }
        if (pathOrder === tailB) {
          opacity = Math.max(opacity, weight * SECONDARY_COMET_SCALE);
        }
      }

      return { style: { opacity: Math.min(1, opacity) } };
    };
  }, [headStep, reducedMotion]);

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
