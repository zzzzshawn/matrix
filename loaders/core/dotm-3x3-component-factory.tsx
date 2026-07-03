"use client";

import { DotMatrix3Base } from "../base/dot-matrix-3-base";
import { useDotMatrixPhases } from "./phases";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

type Dotm3x3ComponentProps = DotMatrixCommonProps;

export function createDotm3x3Component(
  displayName: string,
  animationResolver: DotAnimationResolver,
  defaultSpeed = 1.15
) {
  function Dotm3x3Component({
    pattern = "full",
    dotShape = "circle",
    animated = true,
    hoverAnimated = false,
    speed = defaultSpeed,
    ...rest
  }: Dotm3x3ComponentProps) {
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

  Dotm3x3Component.displayName = displayName;
  return Dotm3x3Component;
}
