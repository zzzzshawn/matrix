"use client";

import type { CSSProperties } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { trBlPathNormFromIndex } from "../core/grid-paths";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver } from "../types";
import type { DotMatrixCommonProps } from "../types";

export type DiagonalTrBlSweepMatrixProps = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, row, col, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const path = trBlPathNormFromIndex(index);
  const slice = row + (4 - col);
  const parity = slice % 2;
  const style = {
    "--dmx-path": path,
    "--dmx-diagonal-parity": parity
  } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: parity === 0 ? 0.88 : 0.14
      }
    };
  }

  return { className: "dmx-diagonal-alt-sweep", style };
};

export function DiagonalTrBlSweepMatrix({
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: DiagonalTrBlSweepMatrixProps) {
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
