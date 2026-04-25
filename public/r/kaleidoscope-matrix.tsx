"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { rowMajorIndex } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type KaleidoscopeMatrixProps = DotMatrixCommonProps;

type FrameCell = "." | "o" | "x";

const BASE_OPACITY = 0.08;
const MID_OPACITY = 0.52;
const PEAK_OPACITY = 1;
const SMOOTH_TRANSITION = "opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)";

const FRAME_MASKS: readonly string[] = [
  // Diagonal star
  "x...x" + ".x.x." + "..o.." + ".x.x." + "x...x",
  // Diamond bloom
  "..x.." + ".oxo." + "xooox" + ".oxo." + "..x..",
  // Petal ring
  ".x.x." + "x.o.x" + "..o.." + "x.o.x" + ".x.x.",
  // Crossed lattice
  "x.x.x" + ".o.o." + "x.o.x" + ".o.o." + "x.x.x"
];

const FRAME_SEQUENCE: readonly number[] = [0, 1, 2, 3, 2, 1];

function maskCell(mask: string, row: number, col: number): FrameCell {
  return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
}

export function KaleidoscopeMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: KaleidoscopeMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const sequenceLength = FRAME_SEQUENCE.length;

  useEffect(() => {
    if (reducedMotion || !animated) {
      setStep(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1900 / safeSpeed;
    const stepMs = Math.max(64, Math.round(cycleMs / sequenceLength));
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
        return { style: { opacity: PEAK_OPACITY, transition: SMOOTH_TRANSITION } };
      }
      if (cell === "o") {
        return { style: { opacity: MID_OPACITY, transition: SMOOTH_TRANSITION } };
      }
      return { style: { opacity: BASE_OPACITY, transition: SMOOTH_TRANSITION } };
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
