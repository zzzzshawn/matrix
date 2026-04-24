"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { useDotMatrixPhases } from "../core/phases";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type DotMatrixIconProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({
  isActive,
  phase,
  reducedMotion,
  distanceFromCenter
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  if (reducedMotion) {
    return {};
  }

  if (phase === "loadingRipple") {
    const ring = Math.round(distanceFromCenter);
    return {
      className: "dmx-ripple",
      style: { "--dmx-ripple-ring": ring } as CSSProperties
    };
  }

  if (phase === "collapse") {
    return { className: "dmx-collapse" };
  }

  if (phase === "hoverRipple") {
    return { className: "dmx-hover-ripple" };
  }

  return {};
};

export function DotMatrixIcon({
  size = 24,
  dotSize = 3,
  color = "currentColor",
  speed = 1,
  ariaLabel = "Loading",
  className,
  pattern = "diamond",
  muted = false,
  animated = false,
  hoverAnimated = true,
  dotClassName
}: DotMatrixIconProps) {
  const reducedMotion = usePrefersReducedMotion();

  const { phase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: animated && !reducedMotion,
    hoverAnimated: hoverAnimated && !animated && !reducedMotion,
    speed
  });

  return (
    <DotMatrixBase
      size={size}
      dotSize={dotSize}
      color={color}
      speed={speed}
      ariaLabel={ariaLabel}
      className={className}
      pattern={pattern}
      muted={muted}
      dotClassName={dotClassName}
      phase={phase}
      reducedMotion={reducedMotion}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animationResolver={animationResolver}
    />
  );
}
