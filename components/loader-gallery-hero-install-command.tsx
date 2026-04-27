"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CopyClipboardIcon } from "@/components/package-manager-install-toolbar";

interface LoaderGalleryHeroInstallCommandProps {
  installCommand: string;
}

export const LoaderGalleryHeroInstallCommand = memo(function LoaderGalleryHeroInstallCommand({
  installCommand
}: LoaderGalleryHeroInstallCommandProps) {
  const [heroInstallCopied, setHeroInstallCopied] = useState(false);
  const heroCopyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyHeroInstallCommand = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(installCommand);
      setHeroInstallCopied(true);
      if (heroCopyResetRef.current) {
        clearTimeout(heroCopyResetRef.current);
      }
      heroCopyResetRef.current = setTimeout(() => {
        setHeroInstallCopied(false);
        heroCopyResetRef.current = null;
      }, 2000);
    } catch {
      // Ignore unsupported contexts.
    }
  }, [installCommand]);

  useEffect(() => {
    return () => {
      if (heroCopyResetRef.current) {
        clearTimeout(heroCopyResetRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="w-max rounded-lg bg-surface p-1">
        <div className="flex min-w-0 max-w-full items-center gap-1 rounded-sm bg-bg py-2 px-3">
          <p className="min-w-0 text-[11px] leading-normal text-fg sm:text-base">
            {installCommand}
          </p>
        </div>
      </div>
      <div className="w-max rounded-lg bg-surface p-1">
        <div className="flex min-w-0 max-w-full items-center gap-1 rounded-sm bg-bg p-2 sm:p-[10px]">
          <button
            type="button"
            onClick={() => void copyHeroInstallCommand()}
            aria-label={heroInstallCopied ? "Copied" : "Copy install command"}
            className="inline-flex min-w-0 items-center justify-center text-fg-strong transition-colors duration-150 ease-out hover:opacity-90"
          >
            {heroInstallCopied ? (
              <CheckIcon className="size-4 sm:size-[18px]" />
            ) : (
              <CopyClipboardIcon className="size-4 sm:size-[18px]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
