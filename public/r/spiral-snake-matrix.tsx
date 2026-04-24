"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { spiralInwardNormFromIndex, spiralInwardOrderValue } from "../core/grid-paths";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type SpiralSnakeMatrixProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = spiralInwardOrderValue(index);
  const pathNorm = spiralInwardNormFromIndex(index);
  const style = { "--dmx-spiral-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78
      }
    };
  }

  return { className: "dmx-spiral-snake", style };
};

export function SpiralSnakeMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: SpiralSnakeMatrixProps) {
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
