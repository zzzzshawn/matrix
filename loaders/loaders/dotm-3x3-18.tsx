"use client";

import { createGlyphSpin3Component } from "../core/glyph-spin-3-factory";
import type { DotMatrixCommonProps } from "../types";

export type Dotm3x3_18Props = DotMatrixCommonProps;

/** Checkmark — row-major 0/1 form. */
const CHECK_GLYPH = [0, 0, 1, 0, 1, 0, 1, 0, 0] as const;

export const Dotm3x3_18 = createGlyphSpin3Component("Dotm3x3_18", CHECK_GLYPH);
