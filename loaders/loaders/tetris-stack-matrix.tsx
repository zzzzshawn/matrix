"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { rowMajorIndex } from "../core/patterns";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type TetrisStackMatrixProps = DotMatrixCommonProps;

type FrameCell = "." | "o" | "x" | "c";

const BASE_OPACITY = 0.08;
const SETTLED_OPACITY = 0.42;
const ACTIVE_OPACITY = 1;
const CLEAR_OPACITY = 0.88;
const IDLE_STEP = 10;

const FRAME_MASKS: readonly string[] = [
  "....." + "....." + "....." + "....." + "ooooo",
  "....." + "....." + "....." + "ooooo" + "ooooo",
  "....." + "....." + "ooooo" + "ooooo" + "ooooo",
  "....." + "ooooo" + "ooooo" + "ooooo" + "ooooo",
  "ooooo" + "ooooo" + "ooooo" + "ooooo" + "ooooo",
  "ccccc" + "ccccc" + "ccccc" + "ccccc" + "ccccc",
  "....." + "....." + "....." + "....." + ".....",
  "ccccc" + "ccccc" + "ccccc" + "ccccc" + "ccccc",
  "....." + "....." + "....." + "....." + ".....",
  "....." + "....." + "....." + "....." + "....."
];

const FRAME_SEQUENCE: readonly number[] = [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9];

function maskCell(mask: string, row: number, col: number): FrameCell {
  return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
}

export function TetrisStackMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: TetrisStackMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const sequenceLength = FRAME_SEQUENCE.length;

  useEffect(() => {
    if (reducedMotion || !animated || sequenceLength === 0) {
      setStep(Math.min(IDLE_STEP, sequenceLength - 1));
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1900 / safeSpeed;
    const stepMs = Math.max(56, Math.round(cycleMs / sequenceLength));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % sequenceLength);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, sequenceLength, speed]);

  const frame = FRAME_SEQUENCE[step] ?? FRAME_SEQUENCE[0] ?? 0;

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ isActive, row, col }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      const cell = maskCell(FRAME_MASKS[frame]!, row, col);
      if (cell === "x") {
        return { style: { opacity: ACTIVE_OPACITY } };
      }
      if (cell === "o") {
        return { style: { opacity: SETTLED_OPACITY } };
      }
      if (cell === "c") {
        return { style: { opacity: CLEAR_OPACITY } };
      }
      return { style: { opacity: BASE_OPACITY } };
    };
  }, [frame]);

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern={pattern}
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={resolver}
    />
  );
}
