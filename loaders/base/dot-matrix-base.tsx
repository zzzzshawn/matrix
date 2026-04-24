"use client";

import type { CSSProperties } from "react";

import { cx } from "../core/cx";
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
  animationResolver
}: DotMatrixBaseProps) {
  const patternIndexes = new Set(getPatternIndexes(pattern));
  const safeSpeed = speed > 0 ? speed : 1;
  const speedScale = 1 / safeSpeed;
  const gap = Math.max(1, Math.floor((size - dotSize * MATRIX_SIZE) / (MATRIX_SIZE - 1)));
  const center = Math.floor(MATRIX_SIZE / 2);

  const rootStyle = {
    width: size,
    height: size,
    "--dmx-speed": speedScale,
    color
  } as CSSProperties;

  const unit = dotSize + gap;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cx("dmx-root", muted && "dmx-muted", className)}
      style={rootStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dmx-grid" style={{ gap }}>
        {Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }).map((_, index) => {
          const { row, col } = indexToCoord(index);
          const isActive = patternIndexes.has(index);
          const distance = distanceFromCenter(index);
          const angle = polarAngle(index);
          const radiusNormalizedValue = normalizedRadius(index);
          const manhattan = manhattanDistance(index);
          const deltaX = (col - center) * unit;
          const deltaY = (row - center) * unit;

          const animationState = animationResolver
            ? animationResolver({
                index,
                row,
                col,
                distanceFromCenter: distance,
                angleFromCenter: angle,
                radiusNormalized: radiusNormalizedValue,
                manhattanDistance: manhattan,
                phase,
                isActive,
                reducedMotion
              })
            : {};

          const dotStyle = {
            width: dotSize,
            height: dotSize,
            "--dmx-distance": distance,
            "--dmx-row": row,
            "--dmx-col": col,
            "--dmx-x": `${deltaX}px`,
            "--dmx-y": `${deltaY}px`,
            "--dmx-angle": angle,
            "--dmx-radius": radiusNormalizedValue,
            "--dmx-manhattan": manhattan,
            ...animationState.style,
            // Pattern off-cells: keyframe animations override class/inline opacity; nuke animation + hide.
            ...(!isActive
              ? {
                  opacity: 0,
                  visibility: "hidden" as const,
                  pointerEvents: "none" as const,
                  animation: "none"
                }
              : {})
          } as CSSProperties;

          return (
            <span
              key={index}
              aria-hidden="true"
              className={cx(
                "dmx-dot",
                !isActive && "dmx-inactive",
                dotClassName,
                animationState.className
              )}
              style={dotStyle}
            />
          );
        })}
      </div>
    </div>
  );
}
