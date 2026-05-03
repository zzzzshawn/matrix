"use client";

import { GeistPixelCircle } from "geist/font/pixel";
import Link from "next/link";
import { memo, type ReactNode } from "react";

interface DrawerPreviewPaneProps {
  selectedSlug?: string;
  selectedTitle?: string;
  preview: ReactNode;
}

export const DrawerPreviewPane = memo(function DrawerPreviewPane({
  selectedSlug,
  selectedTitle,
  preview
}: DrawerPreviewPaneProps) {
  if (!selectedTitle) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg">
      <div className="flex shrink-0 items-center justify-between gap-3 px-3 pt-3">
        <h2
          className={`${GeistPixelCircle.className} theme-text-strong min-w-0 text-left text-base font-semibold tracking-tight pl-1`}
        >
          {selectedTitle}
        </h2>
        {selectedSlug ? (
          <Link
            href={`/playground?loader=${encodeURIComponent(selectedSlug)}`}
            className="theme-text shrink-0 rounded-md hover:bg-surface-soft px-2.5 py-1.5 text-xs font-medium transition-[background-color,color,transform] duration-200 ease-out bg-background hover:text-link-hover active:scale-[0.98] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
          >
            Open in playground
          </Link>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {preview}
      </div>
    </section>
  );
});
