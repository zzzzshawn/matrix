"use client";

import { memo } from "react";

export const ExampleUsageDotRail = memo(function ExampleUsageDotRail() {
  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {Array.from({ length: 150 }).map((_, i) => (
        <div key={i} className="size-0.5 shrink-0 rounded-full bg-dot-faint" />
      ))}
    </div>
  );
});
