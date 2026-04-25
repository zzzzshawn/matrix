"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DotMatrixPhase } from "./dotmatrix-core";

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPrefersReducedMotion(query.matches);
    };

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}

export interface UseCyclePhaseOptions {
  active: boolean;
  cycleMsBase: number;
  speed?: number;
}

export function useCyclePhase({ active, cycleMsBase, speed = 1 }: UseCyclePhaseOptions): number {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }

    const safeSpeed = speed > 0 ? speed : 1;
    const cycleMs = Math.max(120, cycleMsBase / safeSpeed);
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = ((now - start) % cycleMs + cycleMs) % cycleMs;
      setPhase(elapsed / cycleMs);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, cycleMsBase, speed]);

  return phase;
}

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
