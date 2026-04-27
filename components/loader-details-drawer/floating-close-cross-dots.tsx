"use client";

import { memo } from "react";
import { CLOSE_CROSS_CHASE_ORDER } from "@/components/loader-details-drawer.constants";
import { usePrefersReducedMotion } from "@/loaders/hooks/use-prefers-reduced-motion";

export const FloatingCloseCrossDots = memo(function FloatingCloseCrossDots() {
  const reducedMotion = usePrefersReducedMotion();
  const stepMs = 70;

  return (
    <span className="grid grid-cols-5 gap-px" aria-hidden>
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const isCross = row === col || row + col === 4;
        if (!isCross) {
          return <span key={index} className="h-[3px] w-[3px] rounded-full bg-dot-faint" />;
        }
        if (reducedMotion) {
          return <span key={index} className="h-[3px] w-[3px] rounded-full bg-dot-on" />;
        }
        const order = CLOSE_CROSS_CHASE_ORDER[index] ?? 0;
        return (
          <span
            key={index}
            className="h-[3px] w-[3px] rounded-full bg-dot-on motion-safe:animate-close-cross-dot"
            style={{ animationDelay: `${(order * stepMs) / 1000}s` }}
          />
        );
      })}
    </span>
  );
});
