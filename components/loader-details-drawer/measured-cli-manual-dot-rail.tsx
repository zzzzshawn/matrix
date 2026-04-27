"use client";

import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  CLI_MANUAL_DOT_GAP_PX,
  CLI_MANUAL_DOT_ROW_H
} from "@/components/loader-details-drawer.constants";

interface MeasuredCliManualDotRailProps {
  activeTab: "cli" | "manual";
  onTabChange: (tab: "cli" | "manual") => void;
}

export const MeasuredCliManualDotRail = memo(function MeasuredCliManualDotRail({
  activeTab,
  onTabChange
}: MeasuredCliManualDotRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const cliRef = useRef<HTMLButtonElement>(null);
  const manualRef = useRef<HTMLButtonElement>(null);
  const [{ width, cli, manual }, setGeom] = useState<{
    width: number;
    cli: [number, number] | null;
    manual: [number, number] | null;
  }>({ width: 0, cli: null, manual: null });

  const measure = useCallback(() => {
    const rail = railRef.current;
    const c = cliRef.current;
    const m = manualRef.current;
    if (!rail || !c || !m) {
      return;
    }
    const r = rail.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    const mr = m.getBoundingClientRect();
    setGeom({
      width: r.width,
      cli: [cr.left - r.left, cr.right - r.left],
      manual: [mr.left - r.left, mr.right - r.left]
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, activeTab]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(rail);
    return () => ro.disconnect();
  }, [measure]);

  const dotCount = width > 0 ? Math.max(25, Math.round(width / CLI_MANUAL_DOT_GAP_PX)) : 0;

  return (
    <div ref={railRef} className="inline-flex flex-col items-stretch gap-0 w-max">
      <div className="inline-flex gap-0">
        <button
          ref={cliRef}
          type="button"
          onClick={() => onTabChange("cli")}
          className={`rounded-lg focus-visible:outline-none! focus-visible:ring-0! pr-2 pl-1.5 text-xs font-medium transition ${activeTab === "cli" ? "text-fg-strong" : "text-fg-muted hover:text-fg"
            }`}
        >
          CLI
        </button>
        <button
          ref={manualRef}
          type="button"
          onClick={() => onTabChange("manual")}
          className={`rounded-lg focus-visible:outline-none! focus-visible:ring-0! pl-2 pr-1.5 text-xs font-medium transition ${activeTab === "manual" ? "text-fg-strong" : "text-fg-muted hover:text-fg"
            }`}
        >
          Manual
        </button>
      </div>
      <div
        className="relative shrink-0"
        style={{ height: CLI_MANUAL_DOT_ROW_H }}
        aria-hidden
      >
        {width > 0 && cli && manual && dotCount > 0
          ? Array.from({ length: dotCount }, (_, i) => {
            const t = (i + 0.5) / dotCount;
            const x = t * width;
            const inCli = x >= cli[0] && x <= cli[1];
            const inManual = x >= manual[0] && x <= manual[1];
            const lit = activeTab === "cli" ? inCli : inManual;
            return (
              <span
                key={i}
                className={`absolute top-1/2 size-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ease-out ${lit ? "bg-dot-on" : "bg-dot-off"
                  }`}
                style={{ left: `${t * 100}%` }}
              />
            );
          })
          : null}
      </div>
    </div>
  );
});
