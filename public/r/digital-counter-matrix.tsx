"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { rowMajorIndex } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type DigitalCounterMatrixProps = DotMatrixCommonProps;

type FrameCell = "." | "o" | "x";

const BASE_OPACITY = 0.08;
const ON_OPACITY = 0.56;
const PEAK_OPACITY = 1;

const FRAME_MASKS: readonly string[] = [
  // N
  "..x.." + "..x.." + "..o.." + "....." + ".....",
  // NE
  "....x" + "...x." + "..o.." + "....." + ".....",
  // E
  "....." + "....." + "..oxx" + "....." + ".....",
  // SE
  "....." + "....." + "..o.." + "...x." + "....x",
  // S
  "....." + "....." + "..o.." + "..x.." + "..x..",
  // SW
  "....." + "....." + "..o.." + ".x..." + "x....",
  // W
  "....." + "....." + "xxo.." + "....." + ".....",
  // NW
  "x...." + ".x..." + "..o.." + "....." + "....."
];

const FRAME_SEQUENCE: readonly number[] = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];

function maskCell(mask: string, row: number, col: number): FrameCell {
  return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
}

export function DigitalCounterMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: DigitalCounterMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const sequenceLength = FRAME_SEQUENCE.length;

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1850 / safeSpeed;
    const stepMs = Math.max(56, Math.round(cycleMs / sequenceLength));
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % sequenceLength);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, sequenceLength, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    const frameIndex = FRAME_SEQUENCE[step] ?? 0;
    const mask = FRAME_MASKS[frameIndex] ?? FRAME_MASKS[0]!;

    return ({ isActive, row, col }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      const cell = maskCell(mask, row, col);
      if (cell === "x") {
        return { style: { opacity: PEAK_OPACITY } };
      }
      if (cell === "o") {
        return { style: { opacity: ON_OPACITY } };
      }
      return { style: { opacity: BASE_OPACITY } };
    };
  }, [step]);

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
