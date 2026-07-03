"use client";

import { createGlyphSpin3Component } from "../core/glyph-spin-3-factory";
import type { DotMatrixCommonProps } from "../types";

export type Dotm3x3_16Props = DotMatrixCommonProps;

/** Smiley — eyes and mouth in row-major 0/1 form. */
const SMILEY_GLYPH = [1, 0, 1, 0, 0, 0, 0, 1, 0] as const;

export const Dotm3x3_16 = createGlyphSpin3Component("Dotm3x3_16", SMILEY_GLYPH);
