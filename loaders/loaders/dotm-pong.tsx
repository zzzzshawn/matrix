"use client";

import { useEffect, useState } from "react";
import { resolveDmxColorTokens } from "../core/color-presets";
import type { DotMatrixCommonProps } from "../types";

export interface DotmPongProps extends DotMatrixCommonProps {
  gridSize?: number;
  cellSize?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
}

type BallState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function DotmPong({
  gridSize = 8,
  cellSize,
  gap,
  speed = 50,
  activeColor,
  inactiveColor = "#27272a",
  className = "",
  size,
  dotSize,
  color,
  colorPreset,
  dotShape = "circle",
  ...rest
}: DotmPongProps) {

  let resolvedCellSize = cellSize ?? dotSize ?? 8;
  let resolvedGap = gap ?? 2;

  if (size !== undefined && size > 10) {
    resolvedCellSize = Math.max(2, Math.round(size / 7.5));
    resolvedGap = Math.max(1, Math.round(resolvedCellSize * 0.3));
  } else if (dotSize !== undefined && dotSize > 1) {
    resolvedCellSize = dotSize;
    resolvedGap = Math.max(1, Math.round(dotSize * 0.3));
  }

  const { resolvedColor } = resolveDmxColorTokens(activeColor || color || "#ffffff", colorPreset);

  const intervalDelay = speed < 10 ? Math.max(10, Math.round(60 / speed)) : speed;

  const [gameState, setGameState] = useState({
    ball: { x: 3, y: 3, dx: 1, dy: 1 },
    leftPaddle: 2,
    rightPaddle: 2,
  });

  const { ball, leftPaddle, rightPaddle } = gameState;

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        let { ball, leftPaddle, rightPaddle } = prev;
        let { x, y, dx, dy } = ball;

        let nextX = x + dx;
        let nextY = y + dy;

        if (nextY <= 0 || nextY >= gridSize - 1) {
          dy *= -1;
        }

        let nextLeftPaddle = leftPaddle;
        if (dx < 0) {
          nextLeftPaddle = clamp(nextY - 1, 0, gridSize - 3);
        }

        let nextRightPaddle = rightPaddle;
        if (dx > 0) {
          nextRightPaddle = clamp(nextY - 1, 0, gridSize - 3);
        }

        const leftHit =
          nextX === 1 &&
          nextY >= nextLeftPaddle &&
          nextY <= nextLeftPaddle + 2;

        const rightHit =
          nextX === gridSize - 2 &&
          nextY >= nextRightPaddle &&
          nextY <= nextRightPaddle + 2;

        if (leftHit || rightHit) {
          dx *= -1;
        }

        if (nextX < 0 || nextX > gridSize - 1) {
          return {
            ball: {
              x: Math.floor(gridSize / 2),
              y: Math.floor(gridSize / 2),
              dx: Math.random() > 0.5 ? 1 : -1,
              dy: Math.random() > 0.5 ? 1 : -1,
            },
            leftPaddle: 2,
            rightPaddle: 2,
          };
        }

        return {
          ball: {
            x: nextX,
            y: nextY,
            dx,
            dy,
          },
          leftPaddle: nextLeftPaddle,
          rightPaddle: nextRightPaddle,
        };
      });
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [gridSize, intervalDelay]);

  const cells = Array.from({ length: gridSize * gridSize });
  
  let borderRadius = "4px";
  if (dotShape === "circle") borderRadius = "999px";
  else if (dotShape === "square") borderRadius = "0px";

  return (
    <div
      className={`inline-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${resolvedCellSize}px)`,
        gap: resolvedGap,
      }}
      {...rest}
    >
      {cells.map((_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const isLeft =
          col === 0 &&
          row >= leftPaddle &&
          row <= leftPaddle + 2;

        const isRight =
          col === gridSize - 1 &&
          row >= rightPaddle &&
          row <= rightPaddle + 2;

        const isBall =
          col === ball.x && row === ball.y;

        return (
          <div
            key={index}
            className="transition-colors duration-75"
            style={{
              width: resolvedCellSize,
              height: resolvedCellSize,
              borderRadius,
              backgroundColor:
                isLeft || isRight || isBall
                  ? resolvedColor
                  : inactiveColor,
            }}
          />
        );
      })}
    </div>
  );
}