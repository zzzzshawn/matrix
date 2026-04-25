"use client";

import { useEffect, useMemo, useState } from "react";

import { DotMatrixBase } from "./dotmatrix-core";
import { rowMajorIndex } from "./dotmatrix-core";
import { usePrefersReducedMotion } from "./dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "./dotmatrix-core";

export type RowWaveMatrixProps = DotMatrixCommonProps;

const SNAKE_TAIL = [1, 0.82, 0.68, 0.54, 0.42, 0.31, 0.22, 0.14] as const;
const BASE_OPACITY = 0.08;

function buildRowCyclePath(): number[] {
  const path: number[] = [];
  const push = (row: number, col: number) => path.push(rowMajorIndex(row, col));

  // 1st col: bottom -> top
  for (let row = 4; row >= 0; row -= 1) push(row, 0);
  // top to 3rd col
  push(0, 1);
  push(0, 2);
  // 3rd col: top -> bottom
  for (let row = 1; row <= 4; row += 1) push(row, 2);
  // bottom left to 2nd col
  push(4, 1);
  // 2nd col: bottom -> top
  for (let row = 3; row >= 0; row -= 1) push(row, 1);
  // top right to 4th col
  push(0, 2);
  push(0, 3);
  // 4th col: top -> bottom
  for (let row = 1; row <= 4; row += 1) push(row, 3);
  // bottom left to 3rd col
  push(4, 2);
  // 3rd col: bottom -> top
  for (let row = 3; row >= 0; row -= 1) push(row, 2);
  // top right to 5th col
  push(0, 3);
  push(0, 4);
  // 5th col: top -> bottom
  for (let row = 1; row <= 4; row += 1) push(row, 4);

  return path;
}

export function RowWaveMatrix({
  speed = 1,
  pattern = "full",
  animated = true,
  hoverAnimated = false,
  ...rest
}: RowWaveMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const route = useMemo(() => buildRowCyclePath(), []);
  const routeLen = route.length;
  const [head, setHead] = useState(0);

  const visitsByIndex = useMemo(() => {
    const visits = new Map<number, number[]>();
    for (let step = 0; step < routeLen; step += 1) {
      const index = route[step]!;
      const list = visits.get(index) ?? [];
      list.push(step);
      visits.set(index, list);
    }
    return visits;
  }, [route, routeLen]);

  useEffect(() => {
    if (reducedMotion || !animated || routeLen === 0) {
      setHead(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = 1500 / safeSpeed;
    const stepMs = Math.max(24, Math.round(cycleMs / routeLen));
    const timer = window.setInterval(() => {
      setHead((prev) => (prev + 1) % routeLen);
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [animated, reducedMotion, routeLen, speed]);

  const animationResolver: DotAnimationResolver = ({ isActive, index }) => {
    if (!isActive) {
      return { className: "dmx-inactive" };
    }

    const visits = visitsByIndex.get(index) ?? [];
    let opacity = BASE_OPACITY;
    for (const step of visits) {
      const distance = (head - step + routeLen) % routeLen;
      if (distance >= 0 && distance < SNAKE_TAIL.length) {
        opacity = Math.max(opacity, SNAKE_TAIL[distance]!);
      }
    }

    return { style: { opacity } };
  };

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern={pattern}
      animated={animated}
      hoverAnimated={hoverAnimated}
      phase={animated && !reducedMotion ? "loadingRipple" : "idle"}
      reducedMotion={reducedMotion}
      animationResolver={animationResolver}
    />
  );
}
