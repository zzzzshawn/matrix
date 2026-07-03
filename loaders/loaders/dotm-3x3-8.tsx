"use client";

import type { CSSProperties } from "react";

import { createDotm3x3Component } from "../core/dotm-3x3-component-factory";
import { rowWave3NormFromRow, wave3PathOpacityFromNorm } from "../core/grid-paths-3";
import type { DotAnimationResolver, DotMatrixCommonProps } from "../types";

export type Dotm3x3_8Props = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, row, reducedMotion, phase }) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const path = rowWave3NormFromRow(row);
  const style = { "--dmx-path": path } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: wave3PathOpacityFromNorm(path)
      }
    };
  }

  return { className: "dmx-path-3", style };
};

export const Dotm3x3_8 = createDotm3x3Component("Dotm3x3_8", animationResolver, 1.75);
