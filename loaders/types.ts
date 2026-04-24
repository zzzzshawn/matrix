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
  animated?: boolean;
  hoverAnimated?: boolean;
  dotClassName?: string;
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
