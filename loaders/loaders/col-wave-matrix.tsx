"use client";

import { createPathWaveComponent } from "../core/path-wave-factory";
import { colWaveNormFromIndex } from "../core/grid-paths";
import type { DotMatrixCommonProps } from "../types";

export type ColWaveMatrixProps = DotMatrixCommonProps;

export const ColWaveMatrix = createPathWaveComponent("ColWaveMatrix", ({ index }) =>
  colWaveNormFromIndex(index)
);
