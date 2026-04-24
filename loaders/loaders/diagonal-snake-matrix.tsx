"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { diagonalSnakeNormFromIndex, diagonalSnakeOrderValue } from "../core/grid-paths";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type DiagonalSnakeMatrixProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = diagonalSnakeOrderValue(index);
  const pathNorm = diagonalSnakeNormFromIndex(index);
  const style = { "--dmx-diagonal-snake-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78
      }
    };
  }

  return { className: "dmx-diagonal-snake", style };
};

export function DiagonalSnakeMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: DiagonalSnakeMatrixProps) {
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
