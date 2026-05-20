"use client";

import { useEffect, useState } from "react";

export type DotmPongProps = {
  gridSize?: number;
  cellSize?: number;
  gap?: number;
  speed?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  size?: number;
  dotSize?: number;
};

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
  cellSize = 8,
  gap = 2,
  speed = 60,
  activeColor = "#ffffff",
  inactiveColor = "#27272a",
  className = "",
  size = 1,
  dotSize = 5,
}: DotmPongProps) {

  let resolvedCellSize = cellSize;
  let resolvedGap = gap;

  if (size !== undefined && size > 10) {
    resolvedCellSize = Math.max(2, Math.round(size / 7.5));
    resolvedGap = Math.max(1, Math.round(resolvedCellSize * 0.3));
  } else if (dotSize !== undefined && dotSize > 1) {
    resolvedCellSize = dotSize;
    resolvedGap = Math.max(1, Math.round(dotSize * 0.3));
  }


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
          nextY = y + dy;
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
          nextX = x + dx;
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

  return (
    <div
      className={`inline-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${resolvedCellSize}px)`,
        gap: resolvedGap,
      }}
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
            className="rounded-[4px] transition-colors duration-75"
            style={{
              width: resolvedCellSize,
              height: resolvedCellSize,
              backgroundColor:
                isLeft || isRight || isBall
                  ? activeColor
                  : inactiveColor,
            }}
          />
        );
      })}
    </div>
  );
}