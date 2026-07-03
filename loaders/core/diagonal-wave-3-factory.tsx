"use client";

import type { CSSProperties } from "react";

import { DotMatrix3Base } from "../base/dot-matrix-3-base";
import { useDotMatrixPhases } from "./phases";
import {
  diagonalWave3PathNormFromIndex,
  type DiagonalWave3Direction,
  wave3PathOpacityFromNorm
} from "./grid-paths-3";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export function createDiagonalWave3Resolver(direction: DiagonalWave3Direction): DotAnimationResolver {
  return ({ isActive, index, reducedMotion, phase }) => {
    if (!isActive) {
      return { className: "dmx-inactive" };
    }

    const path = diagonalWave3PathNormFromIndex(index, direction);
    const style = { "--dmx-path": path } as CSSProperties;

    if (reducedMotion || phase === "idle") {
      return {
        style: {
          ...style,
          opacity: wave3PathOpacityFromNorm(path)
        }
      };
    }

    return { className: "dmx-path-3", style };
  };
}

type DiagonalWave3ComponentProps = DotMatrixCommonProps;

export function createDiagonalWave3Component(
  displayName: string,
  direction: DiagonalWave3Direction
) {
  const resolve = createDiagonalWave3Resolver(direction);

  function DiagonalWave3Component({
    pattern = "full",
    animated = true,
    hoverAnimated = false,
    speed = 1.15,
    ...rest
  }: DiagonalWave3ComponentProps) {
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
        animated={animated}
        phase={matrixPhase}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        reducedMotion={reducedMotion}
        animationResolver={resolve}
      />
    );
  }

  DiagonalWave3Component.displayName = displayName;
  return DiagonalWave3Component;
}
