"use client";

import { createPathWaveComponent } from "../core/path-wave-factory";
import { snakePathNormFromIndex } from "../core/grid-paths";
import type { DotMatrixCommonProps } from "../types";

export type SnakePathMatrixProps = DotMatrixCommonProps;

export const SnakePathMatrix = createPathWaveComponent("SnakePathMatrix", ({ index }) =>
  snakePathNormFromIndex(index)
);
