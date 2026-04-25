"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { rowMajorIndex } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularTripleSnakeMatrixProps = DotMatrixCommonProps;

const RING_PATH: readonly number[] = [
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

const LOOP_LEN = RING_PATH.length;
const BASE_OPACITY = 0.08;
const TAIL = [1, 0.74, 0.5, 0.3, 0.16] as const;
const OFFSETS = [0, Math.floor(LOOP_LEN / 3), Math.floor((LOOP_LEN * 2) / 3)] as const;

export function CircularTripleSnakeMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularTripleSnakeMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated) {
      setHead(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1500 / safeSpeed;
    const stepMs = Math.max(18, Math.round(cycleMs / LOOP_LEN));
    const timer = window.setInterval(() => {
      setHead((prev) => (prev + 1) % LOOP_LEN);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ index, row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const onRing = RING_PATH.indexOf(index);
      if (onRing === -1) {
        return { style: { opacity: row === 2 && col === 2 ? 0.18 : BASE_OPACITY } };
      }

      if (reducedMotion || phase === "idle") {
        return { style: { opacity: 0.28 + (onRing / (LOOP_LEN - 1)) * 0.58 } };
      }

      let opacity = BASE_OPACITY;
      for (const offset of OFFSETS) {
        const trailDistance = ((head + offset - onRing) % LOOP_LEN + LOOP_LEN) % LOOP_LEN;
        if (trailDistance < TAIL.length) {
          opacity = Math.max(opacity, TAIL[trailDistance]!);
        }
      }

      return { style: { opacity } };
    };
  }, [head, reducedMotion]);

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
