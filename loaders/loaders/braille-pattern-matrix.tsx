"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "../base/dot-matrix-base";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type BraillePatternMatrixProps = DotMatrixCommonProps;

/**
 * Dots 1–6 in Unicode / ISO braille numbering (matches U+2800 + mask):
 *   1·4
 *   2·5
 *   3·6
 */
const D1 = 0x01;
const D2 = 0x02;
const D3 = 0x04;
const D4 = 0x08;
const D5 = 0x10;
const D6 = 0x20;

const LEFT_RAIL = D1 | D2 | D3;
const RIGHT_RAIL = D4 | D5 | D6;
const TOP_ROW = D1 | D4;
const MID_ROW = D2 | D5;
const BOT_ROW = D3 | D6;
const FULL = D1 | D2 | D3 | D4 | D5 | D6;
const BLANK = 0x00;

/** Left column “odd” / right column “even” — classic 2×3 checkerboard. */
const CHECK_A = D1 | D3 | D5;
const CHECK_B = D2 | D4 | D6;

/** Horseshoe open at bottom (dots 1,2,4,5). */
const OPEN_BOTTOM = D1 | D2 | D4 | D5;
/** Horseshoe open at top (dots 2,3,5,6). */
const OPEN_TOP = D2 | D3 | D5 | D6;

const BASE_OPACITY = 0.08;
const RAISED_OPACITY = 1;
const MID_OPACITY = 0.26;
const GAP_OPACITY = 0.12;

const CELL_ROW_START = 1;
const LEFT_COL = 0;
const RIGHT_CELL_COL = 3;

function repeatMask(mask: number, count: number): number[] {
  return Array.from({ length: count }, () => mask);
}

/**
 * Deliberate motifs (not random): blank → grow left rail → grow to full → three horizontals →
 * checker beat → horseshoes → alternate vertical rails → blank.
 * Both cells use the same mask so the shape reads as a pair of identical braille cells.
 */
const MASK_FRAMES: readonly number[] = [
  ...repeatMask(BLANK, 2),

  D1,
  D1 | D2,
  LEFT_RAIL,
  ...repeatMask(LEFT_RAIL, 2),

  LEFT_RAIL | D4,
  LEFT_RAIL | D4 | D5,
  FULL,
  ...repeatMask(FULL, 3),

  ...repeatMask(TOP_ROW, 3),
  ...repeatMask(MID_ROW, 3),
  ...repeatMask(BOT_ROW, 3),

  ...repeatMask(BLANK, 2),

  ...repeatMask(CHECK_A, 2),
  ...repeatMask(CHECK_B, 2),
  ...repeatMask(CHECK_A, 2),
  ...repeatMask(CHECK_B, 2),

  ...repeatMask(BLANK, 2),

  ...repeatMask(OPEN_BOTTOM, 3),
  ...repeatMask(OPEN_TOP, 3),

  ...repeatMask(BLANK, 2),

  ...repeatMask(LEFT_RAIL, 2),
  ...repeatMask(RIGHT_RAIL, 2),
  ...repeatMask(LEFT_RAIL, 2),
  ...repeatMask(RIGHT_RAIL, 2),

  ...repeatMask(BLANK, 2)
];

const FRAME_COUNT = MASK_FRAMES.length;

function brailleBitForCell(row: number, col: number, cellColStart: number): number | null {
  if (row < CELL_ROW_START || row > CELL_ROW_START + 2) {
    return null;
  }
  const dr = row - CELL_ROW_START;
  if (col === cellColStart) {
    return D1 << dr;
  }
  if (col === cellColStart + 1) {
    return D4 << dr;
  }
  return null;
}

function resolveBraille(row: number, col: number): { cell: 0 | 1; bit: number } | null {
  const left = brailleBitForCell(row, col, LEFT_COL);
  if (left !== null) {
    return { cell: 0, bit: left };
  }
  const right = brailleBitForCell(row, col, RIGHT_CELL_COL);
  if (right !== null) {
    return { cell: 1, bit: right };
  }
  return null;
}

export function BraillePatternMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: BraillePatternMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reducedMotion || !animated || FRAME_COUNT === 0) {
      setFrame(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 5200 / safeSpeed;
    const stepMs = Math.max(52, Math.round(cycleMs / FRAME_COUNT));
    const timer = window.setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, speed]);

  const resolver = useMemo<DotAnimationResolver>(() => {
    return ({ isActive, row, col, phase }) => {
      if (!isActive) {
        return { className: "dmx-inactive" };
      }

      const braille = resolveBraille(row, col);

      if (reducedMotion || phase === "idle") {
        if (braille) {
          const mask = CHECK_A;
          const on = (mask & braille.bit) !== 0;
          return { style: { opacity: on ? MID_OPACITY : BASE_OPACITY } };
        }
        if (row >= CELL_ROW_START && row <= CELL_ROW_START + 2 && col === 2) {
          return { style: { opacity: GAP_OPACITY } };
        }
        return { style: { opacity: BASE_OPACITY } };
      }

      if (row >= CELL_ROW_START && row <= CELL_ROW_START + 2 && col === 2) {
        return { style: { opacity: GAP_OPACITY } };
      }

      if (!braille) {
        return { style: { opacity: BASE_OPACITY } };
      }

      const mask = MASK_FRAMES[frame % FRAME_COUNT] ?? BLANK;
      const on = (mask & braille.bit) !== 0;
      return { style: { opacity: on ? RAISED_OPACITY : BASE_OPACITY } };
    };
  }, [frame, reducedMotion]);

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
