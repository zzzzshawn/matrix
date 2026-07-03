"use client";

import type { CSSProperties } from "react";

import { DotMatrix3Base } from "../base/dot-matrix-3-base";
import { useDotMatrixPhases } from "../core/phases";
import { spiralInward3NormFromIndex, spiralInward3OrderValue, wave3PathOpacityFromNorm } from "../core/grid-paths-3";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type Dotm3x3_1Props = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = spiralInward3OrderValue(index);
  const pathNorm = spiralInward3NormFromIndex(index);
  const style = { "--dmx-spiral-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: wave3PathOpacityFromNorm(pathNorm)
      }
    };
  }

  return { className: "dmx-spiral-snake-3", style };
};

export function Dotm3x3_1({
  speed = 1.15,
  pattern = "full",
  dotShape = "circle",
  animated = true,
  hoverAnimated = false,
  ...rest
}: Dotm3x3_1Props) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed
  });

  return (
    <DotMatrix3Base
      {...rest}
      speed={speed}
      pattern={pattern}
      dotShape={dotShape}
      animated={animated}
      phase={matrixPhase}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
