"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DotMatrixPhase } from "../types";

interface UseDotMatrixPhasesOptions {
  animated?: boolean;
  hoverAnimated?: boolean;
  speed?: number;
}

interface DotMatrixPhasesResult {
  phase: DotMatrixPhase;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function useDotMatrixPhases({
  animated = false,
  hoverAnimated = true,
  speed = 1
}: UseDotMatrixPhasesOptions): DotMatrixPhasesResult {
  const safeSpeed = speed > 0 ? speed : 1;
  const [phase, setPhase] = useState<DotMatrixPhase>(animated ? "loadingRipple" : "idle");
  const sequence = useRef(0);
  const timeouts = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timeout of timeouts.current) {
      window.clearTimeout(timeout);
    }
    timeouts.current = [];
  }, []);

  useEffect(() => {
    sequence.current += 1;
    clearTimers();

    if (animated) {
      setPhase("loadingRipple");
      return clearTimers;
    }

    if (!hoverAnimated) {
      setPhase("idle");
      return clearTimers;
    }

    const current = sequence.current;
    setPhase("collapse");

    const collapseDuration = 300 / safeSpeed;
    const collapseTimeout = window.setTimeout(() => {
      if (sequence.current !== current) {
        return;
      }
      setPhase("hoverRipple");
    }, collapseDuration);

    timeouts.current.push(collapseTimeout);
    return clearTimers;
  }, [animated, hoverAnimated, clearTimers, safeSpeed]);

  const onMouseEnter = useCallback(() => {}, []);

  const onMouseLeave = useCallback(() => {}, []);

  return useMemo(
    () => ({
      phase,
      onMouseEnter,
      onMouseLeave
    }),
    [phase, onMouseEnter, onMouseLeave]
  );
}
