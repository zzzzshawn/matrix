"use client";

import { useEffect, useRef, useState } from "react";

interface UseSteppedCycleOptions {
  active: boolean;
  cycleMsBase: number;
  steps: number;
  speed?: number;
  minStepMs?: number;
  idleStep?: number;
}

type FrameListener = (now: number) => void;

const listeners = new Set<FrameListener>();
let rafId: number | null = null;

function emit(now: number) {
  for (const listener of listeners) {
    listener(now);
  }
}

function tick(now: number) {
  emit(now);
  if (listeners.size > 0) {
    rafId = window.requestAnimationFrame(tick);
  } else {
    rafId = null;
  }
}

function subscribeFrame(listener: FrameListener) {
  listeners.add(listener);
  if (rafId === null) {
    rafId = window.requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/**
 * Shared frame-step clock for loaders to avoid per-loader setInterval state loops.
 */
export function useSteppedCycle({
  active,
  cycleMsBase,
  steps,
  speed = 1,
  minStepMs = 0,
  idleStep = 0
}: UseSteppedCycleOptions): number {
  const safeSteps = Math.max(1, Math.floor(steps));
  const safeSpeed = speed > 0 ? speed : 1;
  const rawCycleMs = cycleMsBase / safeSpeed;
  const rawStepMs = rawCycleMs / safeSteps;
  const stepMs = Math.max(minStepMs, rawStepMs);
  const cycleMs = stepMs * safeSteps;

  const [step, setStep] = useState(() => (active ? 0 : idleStep));
  const startMsRef = useRef<number>(0);
  const activeRef = useRef(false);
  const currentStepRef = useRef(idleStep);

  useEffect(() => {
    if (!active) {
      activeRef.current = false;
      currentStepRef.current = idleStep;
      setStep(idleStep);
      return;
    }

    const updateStep = (now: number) => {
      if (!activeRef.current) {
        startMsRef.current = now;
        activeRef.current = true;
      }

      const elapsed = Math.max(0, now - startMsRef.current);
      const nextStep = Math.floor((elapsed % cycleMs) / stepMs) % safeSteps;
      if (nextStep !== currentStepRef.current) {
        currentStepRef.current = nextStep;
        setStep(nextStep);
      }
    };

    // Sync immediately so the hook has a current step before the next paint.
    updateStep(performance.now());
    return subscribeFrame(updateStep);
  }, [active, cycleMs, idleStep, safeSteps, stepMs]);

  return active ? step : idleStep;
}
