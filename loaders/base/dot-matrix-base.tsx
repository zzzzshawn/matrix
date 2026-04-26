"use client";

import { useMemo, type CSSProperties } from "react";

import { cx } from "../core/cx";
import { getMatrix5Layout, resolveDmxBoxOuterDim } from "../core/matrix-layout";
import {
  distanceFromCenter,
  getPatternIndexes,
  indexToCoord,
  MATRIX_SIZE
} from "../core/patterns";
import { manhattanDistance, normalizedRadius, polarAngle } from "../core/math";
import type { DotAnimationResolver, DotMatrixCommonProps, DotMatrixPhase } from "../types";

interface DotMatrixBaseProps extends DotMatrixCommonProps {
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

export function DotMatrixBase({
  size = 24,
  dotSize = 3,
  color = "currentColor",
  speed = 1,
  ariaLabel = "Loading",
  className,
  pattern = "diamond",
  muted = false,
  dotClassName,
  phase,
  reducedMotion = false,
  onMouseEnter,
  onMouseLeave,
  animationResolver,
  opacityBase,
  opacityMid,
  opacityPeak,
  cellPadding,
  boxSize,
  minSize
}: DotMatrixBaseProps) {
  const safeSpeed = speed > 0 ? speed : 1;
  const speedScale = 1 / safeSpeed;
  const { gap, matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);
  const { outerDim, useWrapper } = resolveDmxBoxOuterDim({ boxSize, minSize });
  const scale = useWrapper && matrixSpan > 0 ? outerDim / matrixSpan : 1;
  const center = Math.floor(MATRIX_SIZE / 2);
  const ob = clamp01(opacityBase);
  const om = clamp01(opacityMid);
  const op = clamp01(opacityPeak);
  const unit = dotSize + gap;

  const dmxVarStyle = useMemo(() => {
    return {
      width: matrixSpan,
      height: matrixSpan,
      "--dmx-speed": speedScale,
      color,
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
  }, [matrixSpan, speedScale, color, ob, om, op, useWrapper, scale, minSize]);

  const gridStyle = useMemo(() => ({ gap }), [gap]);

  const activeMask = useMemo(() => {
    const mask = new Array(MATRIX_SIZE * MATRIX_SIZE).fill(false);
    for (const index of getPatternIndexes(pattern)) {
      mask[index] = true;
    }
    return mask;
  }, [pattern]);

  const dotGeometry = useMemo(
    () =>
      Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }, (_, index) => {
        const { row, col } = indexToCoord(index);
        const distance = distanceFromCenter(index);
        const angle = polarAngle(index);
        const radiusNormalizedValue = normalizedRadius(index);
        const manhattan = manhattanDistance(index);
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

    const dotStyle = !isActive
      ? dot.inactiveStyle
      : animationState?.style
        ? ({ ...dot.baseStyle, ...animationState.style } as CSSProperties)
        : dot.baseStyle;

    return (
      <span
        key={dot.index}
        aria-hidden="true"
        className={cx("dmx-dot", !isActive && "dmx-inactive", dotClassName, animationState?.className)}
        style={dotStyle}
      />
    );
  });

  const matrix = (
    <div className={cx("dmx-root", muted && "dmx-muted", !useWrapper && className)} style={dmxVarStyle}>
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
      className={cx("dmx-root", muted && "dmx-muted", className)}
      style={dmxVarStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dmx-grid" style={gridStyle}>{dots}</div>
    </div>
  );
}
