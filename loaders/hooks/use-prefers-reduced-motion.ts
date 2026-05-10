"use client";

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";

const ReducedMotionOverrideContext = createContext<boolean | null>(null);

interface ReducedMotionOverrideProviderProps {
  reducedMotion: boolean;
  children: ReactNode;
}

export function ReducedMotionOverrideProvider({
  reducedMotion,
  children
}: ReducedMotionOverrideProviderProps) {
  return createElement(
    ReducedMotionOverrideContext.Provider,
    { value: reducedMotion },
    children
  );
}

export function usePrefersReducedMotion(): boolean {
  const reducedMotionOverride = useContext(ReducedMotionOverrideContext);
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

  if (reducedMotionOverride !== null) {
    return reducedMotionOverride;
  }

  return prefersReducedMotion;
}
