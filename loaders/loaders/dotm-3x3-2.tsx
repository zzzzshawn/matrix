"use client";

import { createDiagonalWave3Component } from "../core/diagonal-wave-3-factory";
import type { DotMatrixCommonProps } from "../types";

export type Dotm3x3_2Props = DotMatrixCommonProps;

export const Dotm3x3_2 = createDiagonalWave3Component("Dotm3x3_2", "tr-bl");
