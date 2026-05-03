import type { CSSProperties } from "react";

export type MatrixPattern = "diamond" | "full" | "outline" | "rose" | "cross" | "rings";

export type DotMatrixPhase = "idle" | "collapse" | "hoverRipple" | "loadingRipple";

export interface DotMatrixCommonProps {
  size?: number;
  dotSize?: number;
  color?: string;
  speed?: number;
  ariaLabel?: string;
  className?: string;
  pattern?: MatrixPattern;
  muted?: boolean;
  /**
   * Adds a glow on dots from remapped opacity 0.6 (weakest) through 1 (strongest).
   */
  bloom?: boolean;
  /**
   * Uniform glow on every active dot, 0 (off) through 1 (strongest). Independent of the selective
   * `bloom` curve; when both are set, the stronger per-dot level wins. Slightly wider drop-shadow falloff than `bloom` alone.
   */
  halo?: number;
  animated?: boolean;
  hoverAnimated?: boolean;
  dotClassName?: string;
  /**
   * Drives `--dmx-opacity-base` in CSS. Used in keyframe low/rest stops and idle dot tone (0–1).
   */
  opacityBase?: number;
  /**
   * Drives `--dmx-opacity-mid`. Middle brightness in echo/snake and idle blend (0–1).
   */
  opacityMid?: number;
  /**
   * Drives `--dmx-opacity-peak`. Brightest stops in dmx keyframes (0–1).
   */
  opacityPeak?: number;
  /**
   * Fixed pixel **gap** between the 5×5 grid tracks (independent of `size` / auto gap). When set,
   * the outer width and height become `dotSize * 5 + cellPadding * 4` and `size` is ignored for layout.
   */
  cellPadding?: number;
  /**
   * Exact outer **slot** size (px) for the loader; the matrix is **uniformly scaled** to fit inside
   * (like a viewBox), combined with `minSize` as `max(boxSize, minSize)`.
   */
  boxSize?: number;
  /**
   * Minimum width and height (px) of the root slot, before any `boxSize` scaling.
   */
  minSize?: number;
}

export interface DotAnimationContext {
  index: number;
  row: number;
  col: number;
  distanceFromCenter: number;
  angleFromCenter: number;
  radiusNormalized: number;
  manhattanDistance: number;
  phase: DotMatrixPhase;
  isActive: boolean;
  reducedMotion: boolean;
}

export interface DotAnimationState {
  className?: string;
  style?: CSSProperties;
}

export type DotAnimationResolver = (ctx: DotAnimationContext) => DotAnimationState;
