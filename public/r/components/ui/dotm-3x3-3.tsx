"use client";

import { createDiagonalWave3Component } from "@/components/ui/dotmatrix-core";
import type { DotMatrixCommonProps } from "@/components/ui/dotmatrix-core";

export type Dotm3x3_3Props = DotMatrixCommonProps;

export const Dotm3x3_3 = createDiagonalWave3Component("Dotm3x3_3", "tl-br");
