"use client";

import { createPathWaveComponent } from "../core/path-wave-factory";
import { concentricRingNormFromIndex } from "../core/grid-paths";
import type { DotMatrixCommonProps } from "../types";

export type ConcentricRingMatrixProps = DotMatrixCommonProps;

export const ConcentricRingMatrix = createPathWaveComponent("ConcentricRingMatrix", ({ index }) =>
  concentricRingNormFromIndex(index)
);
