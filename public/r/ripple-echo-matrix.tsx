"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type RippleEchoMatrixProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, manhattanDistance, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const ring = Math.max(0, Math.min(4, manhattanDistance));
  const style = {
    "--dmx-ripple-ring": ring,
    "--dmx-ripple-parity": ring % 2
  } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.2 + (1 - ring / 4) * 0.72
      }
    };
  }

  return { className: "dmx-ripple-echo", style };
};

export function RippleEchoMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: RippleEchoMatrixProps) {
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
