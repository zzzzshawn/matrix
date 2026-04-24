"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type CenterOriginRippleMatrixProps = DotMatrixCommonProps;

// User-defined origin is cell (2,2) in a 1-based 5x5 grid => (row=1,col=1) in zero-based coords.
const ORIGIN_ROW = 1;
const ORIGIN_COL = 1;
const MAX_MANHATTAN = 6;

const animationResolver: DotAnimationResolver = ({ isActive, row, col, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const ring = Math.max(
    0,
    Math.min(MAX_MANHATTAN, Math.abs(row - ORIGIN_ROW) + Math.abs(col - ORIGIN_COL))
  );
  const style = {
    "--dmx-center-ripple-ring": ring
  } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.2 + (1 - ring / MAX_MANHATTAN) * 0.75
      }
    };
  }

  return { className: "dmx-center-origin-ripple", style };
};

export function CenterOriginRippleMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: CenterOriginRippleMatrixProps) {
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
