"use client";

import { GeistPixelCircle } from "geist/font/pixel";
import { memo, type ReactNode } from "react";

interface DrawerPreviewPaneProps {
  selectedTitle?: string;
  preview: ReactNode;
}

export const DrawerPreviewPane = memo(function DrawerPreviewPane({
  selectedTitle,
  preview
}: DrawerPreviewPaneProps) {
  if (!selectedTitle) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg">
      <h2
        className={`${GeistPixelCircle.className} theme-text-strong shrink-0 px-4 pt-4 text-left text-base font-semibold tracking-tight`}
      >
        {selectedTitle}
      </h2>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {preview}
      </div>
    </section>
  );
});
