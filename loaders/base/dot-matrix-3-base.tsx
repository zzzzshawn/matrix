"use client";

import { useMemo, type CSSProperties } from "react";

import { cx } from "../core/cx";
import { dmxBloomHaloSpreadClass, dmxBloomRootActive, dmxDotBloomParts } from "../core/dmx-dot-bloom";
import { getMatrix3Layout } from "../core/matrix-layout-3";
import { remapOpacityToTriplet } from "../core/opacity-triplet";
import { resolveDmxColorTokens } from "../core/color-presets";
import {
  distanceFromCenter3,
  getPattern3Indexes,
  indexToCoord3,
  manhattanDistance3,
  MATRIX_SIZE_3
} from "../core/patterns-3";
import { resolveDmxBoxOuterDim } from "../core/matrix-layout";
import type { DotAnimationResolver, DotMatrixCommonProps, DotMatrixPhase } from "../types";

const MAX_RADIUS_3 = Math.hypot(Math.floor(MATRIX_SIZE_3 / 2), Math.floor(MATRIX_SIZE_3 / 2));

interface DotMatrix3BaseProps extends DotMatrixCommonProps {
  phase: DotMatrixPhase;
  reducedMotion?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  animationResolver?: DotAnimationResolver;
}

function clamp01(n: number | undefined) {
  if (n == null) {
    return;
  }
  if (!Number.isFinite(n)) {
    return;
  }
  return Math.min(1, Math.max(0, n));
}

export function DotMatrix3Base({
  size = 24,
  dotSize = 3,
  color = "currentColor",
  colorPreset,
  speed = 1,
  ariaLabel = "Loading",
  className,
  pattern = "full",
  dotShape = "circle",
  muted = false,
  bloom = false,
  halo = 0,
  dotClassName,
  phase,
  reducedMotion = false,
  onMouseEnter,
  onMouseLeave,
  animationResolver,
  opacityBase = 0.06,
  opacityMid,
  opacityPeak,
  cellPadding = 1,
  boxSize,
  minSize
}: DotMatrix3BaseProps) {
  const safeSpeed = speed > 0 ? speed : 1;
  const speedScale = 1 / safeSpeed;
  const { gap, matrixSpan } = getMatrix3Layout(size, dotSize, cellPadding);
  const { outerDim, useWrapper } = resolveDmxBoxOuterDim({ boxSize, minSize });
  const scale = useWrapper && matrixSpan > 0 ? outerDim / matrixSpan : 1;
  const center = Math.floor(MATRIX_SIZE_3 / 2);
  const ob = clamp01(opacityBase);
  const om = clamp01(opacityMid);
  const op = clamp01(opacityPeak);
  const unit = dotSize + gap;
  const { resolvedColor, dotFill } = resolveDmxColorTokens(color, colorPreset);

  const dmxVarStyle = useMemo(() => {
    return {
      width: matrixSpan,
      height: matrixSpan,
      "--dmx-speed": speedScale,
      ["--dmx-dot-size" as const]: `${dotSize}px`,
      ["--dmx-halo-level" as const]: halo,
      ["--dmx-dot-fill" as const]: dotFill,
      color: resolvedColor,
      ...(ob !== undefined && { ["--dmx-opacity-base" as const]: ob }),
      ...(om !== undefined && { ["--dmx-opacity-mid" as const]: om }),
      ...(op !== undefined && { ["--dmx-opacity-peak" as const]: op }),
      ...(useWrapper
        ? {
          transform: `scale(${scale})`,
          transformOrigin: "center center" as const
        }
        : { minWidth: minSize, minHeight: minSize })
    } as unknown as CSSProperties;
  }, [matrixSpan, speedScale, dotSize, halo, dotFill, resolvedColor, ob, om, op, useWrapper, scale, minSize]);

  const gridStyle = useMemo(
    () => ({
      gap,
      gridTemplateColumns: `repeat(${MATRIX_SIZE_3}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${MATRIX_SIZE_3}, minmax(0, 1fr))`
    }),
    [gap]
  );

  const activeMask = useMemo(() => {
    const mask = new Array(MATRIX_SIZE_3 * MATRIX_SIZE_3).fill(false);
    for (const index of getPattern3Indexes(pattern)) {
      mask[index] = true;
    }
    return mask;
  }, [pattern]);

  const dotGeometry = useMemo(
    () =>
      Array.from({ length: MATRIX_SIZE_3 * MATRIX_SIZE_3 }, (_, index) => {
        const { row, col } = indexToCoord3(index);
        const distance = distanceFromCenter3(index);
        const angle = Math.atan2(row - center, col - center);
        const radiusNormalizedValue = Math.hypot(row - center, col - center) / MAX_RADIUS_3;
        const manhattan = manhattanDistance3(index);
        const deltaX = (col - center) * unit;
        const deltaY = (row - center) * unit;
        const baseStyle = {
          width: dotSize,
          height: dotSize,
          "--dmx-distance": distance,
          "--dmx-row": row,
          "--dmx-col": col,
          "--dmx-x": `${deltaX}px`,
          "--dmx-y": `${deltaY}px`,
          "--dmx-angle": angle,
          "--dmx-radius": radiusNormalizedValue,
          "--dmx-manhattan": manhattan
        } as CSSProperties;

        return {
          index,
          row,
          col,
          distance,
          angle,
          radiusNormalizedValue,
          manhattan,
          baseStyle,
          inactiveStyle: {
            ...baseStyle,
            opacity: 0,
            visibility: "hidden" as const,
            pointerEvents: "none" as const,
            animation: "none"
          } as CSSProperties
        };
      }),
    [dotSize, center, unit]
  );

  const dots = dotGeometry.map((dot) => {
    const isActive = activeMask[dot.index];
    const animationState = animationResolver
      ? animationResolver({
        index: dot.index,
        row: dot.row,
        col: dot.col,
        distanceFromCenter: dot.distance,
        angleFromCenter: dot.angle,
        radiusNormalized: dot.radiusNormalizedValue,
        manhattanDistance: dot.manhattan,
        phase,
        isActive,
        reducedMotion
      })
      : undefined;

    let isBloomDot = false;

    const dotStyle = (() => {
      if (!isActive) {
        return dot.inactiveStyle;
      }
      if (animationState?.style) {
        const resolvedStyle = { ...animationState.style } as CSSProperties;
        const rawOpacity = resolvedStyle.opacity;
        if (typeof rawOpacity === "number") {
          const remappedOpacity = remapOpacityToTriplet(rawOpacity, ob, om, op);
          resolvedStyle.opacity = remappedOpacity;
          const parts = dmxDotBloomParts(true, rawOpacity, bloom, halo, ob, om, op);
          (resolvedStyle as CSSProperties & { "--dmx-bloom-level"?: number })["--dmx-bloom-level"] = parts.level;
          isBloomDot = parts.bloomDot;
        } else {
          const parts = dmxDotBloomParts(true, 0, bloom, halo, ob, om, op);
          if (parts.level > 0) {
            (resolvedStyle as CSSProperties & { "--dmx-bloom-level"?: number })["--dmx-bloom-level"] = parts.level;
          }
          isBloomDot = parts.bloomDot;
        }
        return { ...dot.baseStyle, ...resolvedStyle } as CSSProperties;
      }
      const parts = dmxDotBloomParts(true, 0, bloom, halo, ob, om, op);
      if (parts.level > 0) {
        isBloomDot = parts.bloomDot;
        return { ...dot.baseStyle, ["--dmx-bloom-level" as const]: parts.level } as CSSProperties;
      }
      return dot.baseStyle;
    })();

    return (
      <span
        key={dot.index}
        aria-hidden="true"
        className={cx(
          "dmx-dot",
          !isActive && "dmx-inactive",
          isBloomDot && "dmx-bloom-dot",
          dotClassName,
          animationState?.className
        )}
        style={dotStyle}
      />
    );
  });

  const matrix = (
    <div
      className={cx(
        "dmx-root",
        "dmx-matrix-3",
        `dmx-dot-shape-${dotShape}`,
        muted && "dmx-muted",
        dmxBloomRootActive(bloom, halo) && "dmx-bloom",
        dmxBloomHaloSpreadClass(halo),
        !useWrapper && className
      )}
      style={dmxVarStyle}
    >
      <div className="dmx-grid" style={gridStyle}>{dots}</div>
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
          width: outerDim,
          height: outerDim,
          minWidth: minSize,
          minHeight: minSize,
          overflow: "hidden"
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {matrix}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cx(
        "dmx-root",
        "dmx-matrix-3",
        `dmx-dot-shape-${dotShape}`,
        muted && "dmx-muted",
        dmxBloomRootActive(bloom, halo) && "dmx-bloom",
        dmxBloomHaloSpreadClass(halo),
        className
      )}
      style={dmxVarStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dmx-grid" style={gridStyle}>{dots}</div>
    </div>
  );
}
