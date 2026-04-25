"use client";

import { useMemo } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { isWithinCircularMask } from "./dotmatrix-core";
import { useCyclePhase } from "./dotmatrix-hooks";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type CircularBrailleGlyphCycleMatrixProps = DotMatrixCommonProps;

const STEP_COUNT = 30;
const BASE_OPACITY = 0.07;
const MID_OPACITY = 0.34;
const HIGH_OPACITY = 0.95;

const GLYPHS: ReadonlyArray<ReadonlySet<string>> = [
  new Set(["1,1", "2,1", "3,1", "1,3", "2,3", "3,3"]),
  new Set(["1,1", "2,1", "3,1", "2,2", "1,3", "3,3"]),
  new Set(["1,1", "1,2", "1,3", "3,1", "3,2", "3,3"]),
  new Set(["1,1", "2,1", "3,1", "1,3", "2,2", "3,3"]),
  new Set(["1,1", "2,2", "3,3", "1,3", "3,1"]),
  new Set(["2,1", "1,2", "2,2", "3,2", "2,3"])
];

export function CircularBrailleGlyphCycleMatrix({
  speed = 1,
  animated = true,
  hoverAnimated = false,
  ...rest
}: CircularBrailleGlyphCycleMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animPhase = useCyclePhase({
    active: animated && !reducedMotion && !hoverAnimated,
    cycleMsBase: 1800,
    speed
  });

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ row, col, phase }) => {
      if (!isWithinCircularMask(row, col)) {
        return { className: "dmx-inactive" };
      }

      const t =
        reducedMotion || phase === "idle"
          ? 0
          : Math.floor((animPhase) * GLYPHS.length) % GLYPHS.length;
      const active = GLYPHS[t]!;
      const previous = GLYPHS[(t + GLYPHS.length - 1) % GLYPHS.length]!;
      const key = `${row},${col}`;

      let opacity = BASE_OPACITY;
      if (active.has(key)) {
        opacity = HIGH_OPACITY;
      } else if (previous.has(key)) {
        opacity = MID_OPACITY;
      } else if (row === 2 && col === 2) {
        opacity = 0.2;
      }

      return { style: { opacity } };
    };
  }, [reducedMotion, animPhase]);

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern="full"
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={resolver}
    />
  );
}
