"use client";

import { useMemo } from "react";

import { DotMatrix3Base } from "../base/dot-matrix-3-base";
import { useDotMatrixPhases } from "./phases";
import { useCyclePhase } from "../hooks/use-cycle-phase";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

const BASE_OPACITY = 0.09;
const PEAK_OPACITY = 0.88;
const STEP_MS = 180;
const ROTATION_STEPS = 4;
const CYCLE_MS_BASE = STEP_MS * ROTATION_STEPS;

function smoothstep(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

export function rotate3x3(pattern: readonly number[], turns: number): readonly number[] {
  const t = ((turns % ROTATION_STEPS) + ROTATION_STEPS) % ROTATION_STEPS;
  if (t === 0) {
    return pattern;
  }

  let out = [...pattern];
  for (let k = 0; k < t; k += 1) {
    const next = new Array<number>(9).fill(0);
    for (let i = 0; i < 9; i += 1) {
      const r = Math.floor(i / 3);
      const c = i % 3;
      const nr = c;
      const nc = 2 - r;
      next[nr * 3 + nc] = out[i]!;
    }
    out = next;
  }
  return out;
}

function glyphSpinOpacity(current: readonly number[], next: readonly number[], index: number, t: number): number {
  const weight = (current[index] ?? 0) * (1 - t) + (next[index] ?? 0) * t;
  return BASE_OPACITY + weight * (PEAK_OPACITY - BASE_OPACITY);
}

type GlyphSpin3ComponentProps = DotMatrixCommonProps;

export function createGlyphSpin3Component(
  displayName: string,
  glyph: readonly number[],
  defaultSpeed = 1
) {
  function GlyphSpin3Component({
    speed = defaultSpeed,
    pattern = "full",
    dotShape = "circle",
    animated = true,
    hoverAnimated = false,
    ...rest
  }: GlyphSpin3ComponentProps) {
    const reducedMotion = usePrefersReducedMotion();
    const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
      animated: Boolean(animated && !reducedMotion),
      hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
      speed
    });
    const cyclePhase = useCyclePhase({
      active: !reducedMotion && matrixPhase !== "idle",
      cycleMsBase: CYCLE_MS_BASE,
      speed
    });

    const animationResolver = useMemo<DotAnimationResolver>(() => {
      const scaledPhase = cyclePhase * ROTATION_STEPS;
      const turns = Math.floor(scaledPhase) % ROTATION_STEPS;
      const segmentT = smoothstep(scaledPhase - Math.floor(scaledPhase));
      const current = rotate3x3(glyph, turns);
      const next = rotate3x3(glyph, turns + 1);

      return ({ isActive, index, reducedMotion: rm, phase }) => {
        if (!isActive) {
          return { className: "dmx-inactive" };
        }

        if (rm || phase === "idle") {
          return { style: { opacity: glyphSpinOpacity(glyph, glyph, index, 0) } };
        }

        return { style: { opacity: glyphSpinOpacity(current, next, index, segmentT) } };
      };
    }, [cyclePhase]);

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

  GlyphSpin3Component.displayName = displayName;
  return GlyphSpin3Component;
}
