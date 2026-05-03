"use client";

import type { CSSProperties } from "react";

import { cx } from "@/components/ui/dotmatrix-core";
import { styleOpacity, stylePx } from "@/components/ui/dotmatrix-core";
import { remapOpacityToTriplet } from "@/components/ui/dotmatrix-core";
import { dmxBloomRootActive, dmxDotBloomParts } from "@/components/ui/dotmatrix-core";
import { getPatternIndexes } from "@/components/ui/dotmatrix-core";
import { useDotMatrixPhases } from "@/components/ui/dotmatrix-hooks";
import { useCyclePhase } from "@/components/ui/dotmatrix-hooks";
import { usePrefersReducedMotion } from "@/components/ui/dotmatrix-hooks";
import type { DotMatrixCommonProps } from "@/components/ui/dotmatrix-core";

export type DotmHex6Props = DotMatrixCommonProps;

const ROW_COUNTS = [3, 4, 5, 4, 3] as const;
const BASE_OPACITY = 0.1;
const HIGH_OPACITY = 0.98;
const HEX_ROW_PITCH_RATIO = Math.sqrt(3) / 2;

function hexPatternIndex(row: number, rowCount: number, col: number): number {
  return row * ROW_COUNTS[2] + Math.floor((ROW_COUNTS[2] - rowCount) / 2) + col;
}
const BAND_COUNT = 4;

function clamp01(n: number | undefined) {
  if (n == null || !Number.isFinite(n)) {
    return;
  }
  return Math.min(1, Math.max(0, n));
}

function wrappedDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % BAND_COUNT;
  return Math.min(diff, BAND_COUNT - diff);
}

function opacityForCell(row: number, col: number, phase: number): number {
  const count = ROW_COUNTS[row] ?? 1;
  const x = col - (count - 1) / 2;
  const y = row - 2;
  const downwardChevron = y + Math.abs(x) * 0.92 + 1.55;
  const upwardChevron = -y + Math.abs(x) * 0.92 + 1.55;
  const head = phase * BAND_COUNT;
  const primary = Math.max(0, 1 - wrappedDistance(downwardChevron, head) / 0.78);
  const secondary = Math.max(0, 1 - wrappedDistance(upwardChevron, head + BAND_COUNT / 2) / 0.92);
  const centerLift = row === 2 && col === 2 ? 0.18 : 0;

  return Math.min(HIGH_OPACITY, BASE_OPACITY + primary * 0.78 + secondary * 0.38 + centerLift);
}

export function DotmHex6({
  size = 34,
  dotSize = 5,
  color = "currentColor",
  ariaLabel = "Loading",
  className,
  muted = false,
  bloom = false,
  halo = 0,
  dotClassName,
  speed = 1.55,
  animated = true,
  hoverAnimated = false,
  pattern = "full",
  cellPadding,
  boxSize,
  minSize,
  opacityBase,
  opacityMid,
  opacityPeak
}: DotmHex6Props) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed
  });
  const cyclePhase = useCyclePhase({
    active: !reducedMotion && matrixPhase !== "idle",
    cycleMsBase: 1260,
    speed
  });
  const phase = reducedMotion || matrixPhase === "idle" ? 0.12 : cyclePhase;
  const activePatternIndexes = getPatternIndexes(pattern);
  const gap =
    cellPadding ?? Math.max(1, Math.floor((size - dotSize * ROW_COUNTS[2]) / (ROW_COUNTS[2] - 1)));
  const rowGap = Math.max(1, (dotSize + gap) * HEX_ROW_PITCH_RATIO - dotSize);
  const matrixWidth = dotSize * ROW_COUNTS[2] + gap * (ROW_COUNTS[2] - 1);
  const matrixHeight = dotSize * ROW_COUNTS.length + rowGap * (ROW_COUNTS.length - 1);
  const matrixSpan = Math.max(matrixWidth, matrixHeight);
  const outerDim = Math.max(boxSize ?? matrixSpan, minSize ?? 0);
  const useWrapper = boxSize != null || minSize != null;
  const scale = useWrapper && matrixSpan > 0 ? outerDim / matrixSpan : 1;
  const ob = clamp01(opacityBase);
  const om = clamp01(opacityMid);
  const op = clamp01(opacityPeak);
  const matrixStyle = {
    width: stylePx(matrixWidth),
    height: stylePx(matrixHeight),
    color,
    ["--dmx-dot-size" as const]: `${dotSize}px`,
    ...(ob !== undefined && { ["--dmx-opacity-base" as const]: ob }),
    ...(om !== undefined && { ["--dmx-opacity-mid" as const]: om }),
    ...(op !== undefined && { ["--dmx-opacity-peak" as const]: op }),
    ...(useWrapper
      ? { transform: `scale(${scale})`, transformOrigin: "center center" as const }
      : { minWidth: minSize, minHeight: minSize })
  } as unknown as CSSProperties;

  const matrix = (
    <div
      role={useWrapper ? undefined : "status"}
      aria-live={useWrapper ? undefined : "polite"}
      aria-label={useWrapper ? undefined : ariaLabel}
      className={cx("dmx-root", muted && "dmx-muted", dmxBloomRootActive(bloom, halo) && "dmx-bloom", !useWrapper && className)}
      style={matrixStyle}
      onMouseEnter={useWrapper ? undefined : onMouseEnter}
      onMouseLeave={useWrapper ? undefined : onMouseLeave}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: stylePx(rowGap),
          width: "100%",
          height: "100%"
        }}
      >
        {ROW_COUNTS.map((count, row) => (
          <div key={row} style={{ display: "flex", justifyContent: "center", gap: stylePx(gap) }}>
            {Array.from({ length: count }).map((_, col) => {
              const isActive = activePatternIndexes.includes(hexPatternIndex(row, count, col));
              const opacity = isActive ? opacityForCell(row, col, phase) : 0;
                        const dmxBloom = dmxDotBloomParts(isActive, opacity, bloom, halo, ob, om, op);

          return (
                <span
                  key={`${row},${col}`}
                  aria-hidden="true"
                  className={cx("dmx-dot", !isActive && "dmx-inactive", dmxBloom.bloomDot && "dmx-bloom-dot", dotClassName)}
                  style={{
                    width: stylePx(dotSize),
                    height: stylePx(dotSize),
                    opacity: styleOpacity(remapOpacityToTriplet(opacity, ob, om, op)),
                    ["--dmx-bloom-level" as const]: dmxBloom.level
                  } as CSSProperties}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  if (useWrapper) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: stylePx(outerDim),
          height: stylePx(outerDim),
          minWidth: minSize == null ? undefined : stylePx(minSize),
          minHeight: minSize == null ? undefined : stylePx(minSize),
          overflow: "hidden"
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {matrix}
      </div>
    );
  }

  return matrix;
}
