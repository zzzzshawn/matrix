"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import {
  middleRingAntiClockwiseNormFromIndex,
  middleRingAntiClockwiseOrderValue,
  outerRingClockwiseNormFromIndex,
  outerRingClockwiseOrderValue
} from "../core/grid-paths";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type TripleSnakeMatrixProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, row, col, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const isCenter = row === 2 && col === 2;
  if (isCenter) {
    return { className: "dmx-inactive" };
  }

  const outerOrder = outerRingClockwiseOrderValue(index);
  if (outerOrder >= 0) {
    const outerNorm = outerRingClockwiseNormFromIndex(index);
    const style = { "--dmx-outer-order": outerOrder } as CSSProperties;
    if (reducedMotion || phase === "idle") {
      return {
        style: {
          ...style,
          opacity: 0.2 + outerNorm * 0.72
        }
      };
    }
    return { className: "dmx-outer-snake", style };
  }

  const middleOrder = middleRingAntiClockwiseOrderValue(index);
  const middleNorm = middleRingAntiClockwiseNormFromIndex(index);
  const style = { "--dmx-middle-order": middleOrder } as CSSProperties;
  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.2 + middleNorm * 0.72
      }
    };
  }

  return { className: "dmx-middle-snake", style };
};

export function TripleSnakeMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: TripleSnakeMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <DotMatrixBase
      {...rest}
      pattern={pattern}
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
