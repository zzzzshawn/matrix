"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LoaderDetailsDrawer,
  type ExamplePreviewId,
  type LoaderCard
} from "@/components/loader-details-drawer";
import { CheckIcon, CopyClipboardIcon } from "@/components/package-manager-install-toolbar";

import {
  DotMatrixIcon,
  DotmCircular1,
  DotmCircular10,
  DotmCircular11,
  DotmCircular12,
  DotmCircular13,
  DotmCircular14,
  DotmCircular15,
  DotmCircular16,
  DotmCircular17,
  DotmCircular18,
  DotmCircular19,
  DotmCircular2,
  DotmCircular20,
  DotmCircular3,
  DotmCircular4,
  DotmCircular5,
  DotmCircular6,
  DotmCircular7,
  DotmCircular8,
  DotmCircular9,
  DotmSquare1,
  DotmSquare10,
  DotmSquare11,
  DotmSquare12,
  DotmSquare13,
  DotmSquare14,
  DotmSquare15,
  DotmSquare16,
  DotmSquare17,
  DotmSquare18,
  DotmSquare19,
  DotmSquare2,
  DotmSquare20,
  DotmSquare3,
  DotmSquare4,
  DotmSquare5,
  DotmSquare6,
  DotmSquare7,
  DotmSquare8,
  DotmSquare9,
  DotmTriangle1,
  DotmTriangle2,
  DotmTriangle3,
  DotmTriangle4,
  DotmTriangle5,
  DotmTriangle6,
  DotmTriangle7,
  DotmTriangle8,
  DotmTriangle9,
  DotmTriangle10,
  DotmTriangle11,
  DotmTriangle12,
  DotmTriangle13,
  DotmTriangle14,
  DotmTriangle15,
  DotmTriangle16,
  DotmTriangle17,
  DotmTriangle18,
  DotmTriangle19,
  DotmTriangle20,
  type DotMatrixCommonProps
} from "@/loaders";

interface LoaderGalleryProps {
  items: LoaderCard[];
}

const componentMap = {
  "dotm-square-1": DotmSquare1,
  "dotm-square-2": DotmSquare2,
  "dotm-square-3": DotmSquare3,
  "dotm-square-4": DotmSquare4,
  "dotm-square-5": DotmSquare5,
  "dotm-square-6": DotmSquare6,
  "dotm-square-7": DotmSquare7,
  "dotm-square-8": DotmSquare8,
  "dotm-square-9": DotmSquare9,
  "dotm-square-10": DotmSquare10,
  "dotm-square-11": DotmSquare11,
  "dotm-square-12": DotmSquare12,
  "dotm-square-13": DotmSquare13,
  "dotm-square-14": DotmSquare14,
  "dotm-square-15": DotmSquare15,
  "dotm-square-16": DotmSquare16,
  "dotm-square-17": DotmSquare17,
  "dotm-square-18": DotmSquare18,
  "dotm-square-19": DotmSquare19,
  "dotm-square-20": DotmSquare20,
  "dotm-circular-1": DotmCircular1,
  "dotm-circular-2": DotmCircular2,
  "dotm-circular-3": DotmCircular3,
  "dotm-circular-4": DotmCircular4,
  "dotm-circular-5": DotmCircular5,
  "dotm-circular-6": DotmCircular6,
  "dotm-circular-7": DotmCircular7,
  "dotm-circular-8": DotmCircular8,
  "dotm-circular-9": DotmCircular9,
  "dotm-circular-10": DotmCircular10,
  "dotm-circular-11": DotmCircular11,
  "dotm-circular-12": DotmCircular12,
  "dotm-circular-13": DotmCircular13,
  "dotm-circular-14": DotmCircular14,
  "dotm-circular-15": DotmCircular15,
  "dotm-circular-16": DotmCircular16,
  "dotm-circular-17": DotmCircular17,
  "dotm-circular-18": DotmCircular18,
  "dotm-circular-19": DotmCircular19,
  "dotm-circular-20": DotmCircular20,
  "dotm-triangle-1": DotmTriangle1,
  "dotm-triangle-2": DotmTriangle2,
  "dotm-triangle-3": DotmTriangle3,
  "dotm-triangle-4": DotmTriangle4,
  "dotm-triangle-5": DotmTriangle5,
  "dotm-triangle-6": DotmTriangle6,
  "dotm-triangle-7": DotmTriangle7,
  "dotm-triangle-8": DotmTriangle8,
  "dotm-triangle-9": DotmTriangle9,
  "dotm-triangle-10": DotmTriangle10,
  "dotm-triangle-11": DotmTriangle11,
  "dotm-triangle-12": DotmTriangle12,
  "dotm-triangle-13": DotmTriangle13,
  "dotm-triangle-14": DotmTriangle14,
  "dotm-triangle-15": DotmTriangle15,
  "dotm-triangle-16": DotmTriangle16,
  "dotm-triangle-17": DotmTriangle17,
  "dotm-triangle-18": DotmTriangle18,
  "dotm-triangle-19": DotmTriangle19,
  "dotm-triangle-20": DotmTriangle20
};

const heroNavLinkClassName =
  "text-fg-dim inline-block outline-offset-2 transition-[color,transform] duration-200 ease-out hover:text-link-hover focus-visible:text-link-hover motion-reduce:transition-colors";

const HERO_SHADCN_INSTALL_COMMAND = "npx shadcn@latest add @dotmatrix/dotm-square-3";

const previewSpeed = 1.35;

const previewPropsMap: Record<string, DotMatrixCommonProps> = {
  "dotm-square-1": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.1 },
  "dotm-square-2": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.15 },
  "dotm-square-3": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-4": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.35 },
  "dotm-square-5": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-6": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 2.2 },
  "dotm-square-7": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-8": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.4 },
  "dotm-square-9": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-square-10": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-11": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-12": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-13": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.85 },
  "dotm-square-14": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-15": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-16": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-17": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-18": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.35 },
  "dotm-square-19": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.45 },
  "dotm-square-20": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.45 },
  "dotm-circular-1": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 2.5 },
  "dotm-circular-2": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-circular-3": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-4": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-5": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.7 },
  "dotm-circular-6": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-7": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-circular-8": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.95 },
  "dotm-circular-9": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 5.55 },
  "dotm-circular-10": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-11": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.65 },
  "dotm-circular-12": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.7 },
  "dotm-circular-13": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-14": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-15": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.65 },
  "dotm-circular-16": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.1 },
  "dotm-circular-17": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-18": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-19": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-20": { size: 36, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-1": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 5 },
  "dotm-triangle-2": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-3": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.45 },
  "dotm-triangle-4": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-5": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-triangle-6": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 2.2 },
  "dotm-triangle-7": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.65 },
  "dotm-triangle-8": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.55 },
  "dotm-triangle-9": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-10": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-triangle-11": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.75 },
  "dotm-triangle-12": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-13": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.65 },
  "dotm-triangle-14": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.45 },
  "dotm-triangle-15": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-triangle-16": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.55 },
  "dotm-triangle-17": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-triangle-18": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.6 },
  "dotm-triangle-19": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-20": { size: 30, dotSize: 6.5, pattern: "full", animated: true, speed: 1.7 }
};

/** Default gallery preview; must stay aligned with "Example usage" snippets in the drawer. */
const EXAMPLE_SNIPPET_PROPS: Record<ExamplePreviewId, Partial<DotMatrixCommonProps>> = {
  "ex-opacity": {
    size: 32,
    dotSize: 4,
    speed: 1.4,
    opacityBase: 0.1,
    opacityMid: 0.4,
    opacityPeak: 0.95
  },
  "ex-layout": {
    dotSize: 3,
    cellPadding: 2,
    boxSize: 64,
    minSize: 48
  },
  "ex-look": {
    color: "var(--color-dotmatrix)",
    speed: 0.8,
    muted: true,
    animated: true
  }
};

/** Triangle 7×7 — no dmx opacity tokens; only size/dot/speed in props. */
const EXAMPLE_EX_OPACITY_FOR_TRIANGLE: Partial<DotMatrixCommonProps> = {
  size: 32,
  dotSize: 4,
  speed: 1.4
};

interface LoaderGridCardProps {
  item: LoaderCard;
  onSelect: (slug: string) => void;
  isAnimationEnabled: boolean;
}

const LoaderGridCard = memo(function LoaderGridCard({
  item,
  onSelect,
  isAnimationEnabled
}: LoaderGridCardProps) {
  const Component = componentMap[item.slug as keyof typeof componentMap] ?? DotMatrixIcon;
  const previewProps = previewPropsMap[item.slug] ?? previewPropsMap["dotm-square-1"];
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const handleSelect = useCallback(() => {
    onSelect(item.slug);
  }, [onSelect, item.slug]);
  const shouldAnimate = Boolean(isAnimationEnabled && isNearViewport && (previewProps.animated ?? true));

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsNearViewport(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: "150px 0px",
        threshold: 0
      }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={handleSelect}
      className="aspect-square cursor-pointer bg-surface/80 rounded-3xl relative group"
    >


      <div className="theme-text-strong pointer-events-none absolute inset-x-2 bottom-2 z-20 rounded-md px-2 py-1 text-center text-[11px] font-medium tracking-wide">
        {item.title}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center ">
          <Component {...previewProps} animated={shouldAnimate} />
        </div>
      </div>
    </button>
  );
});

const HeroInstallCommand = memo(function HeroInstallCommand() {
  const [heroInstallCopied, setHeroInstallCopied] = useState(false);
  const heroCopyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyHeroInstallCommand = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(HERO_SHADCN_INSTALL_COMMAND);
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
  }, []);

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
            {HERO_SHADCN_INSTALL_COMMAND}
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

export function LoaderGallery({ items }: LoaderGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeExampleId, setActiveExampleId] = useState<ExamplePreviewId | null>(null);
  const isCardAnimationEnabled = true;
  const handleSelectSlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  const selected = useMemo(
    () => items.find((item) => item.slug === selectedSlug) ?? null,
    [items, selectedSlug]
  );

  const toggleExamplePreview = useCallback((id: ExamplePreviewId) => {
    setActiveExampleId((p) => (p === id ? null : id));
  }, []);

  useEffect(() => {
    setActiveExampleId(null);
  }, [selected?.slug]);

  const selectedPreview = useMemo(() => {
    if (!selected) {
      return <DotMatrixIcon />;
    }

    const SelectedComponent = componentMap[selected.slug as keyof typeof componentMap] ?? DotMatrixIcon;
    const base: DotMatrixCommonProps = previewPropsMap[selected.slug] ?? previewPropsMap["dotm-square-1"];
    const detailSize = base.size ?? 30;
    const detailDotSize = base.dotSize ?? 4;
    const largeSize = Math.round(detailSize * 2.1);
    const largeDotSize = detailDotSize + 5;
    const previewKey = `${selected.slug}-${activeExampleId ?? "default"}`;
    const isSquareMatrix = selected.slug.startsWith("dotm-square-");
    const isTriangleMatrix = selected.slug.startsWith("dotm-triangle-");

    if (activeExampleId) {
      // DotMatrixBase `cellPadding` / `boxSize` only apply to square & circular; triangle
      // uses a 7×7 hand-built grid, so the layout example is not shown in the UI.
      if (activeExampleId === "ex-layout" && isTriangleMatrix) {
        return (
          <SelectedComponent
            key={previewKey}
            {...base}
            size={largeSize}
            dotSize={largeDotSize}
          />
        );
      }
      const snippet: Partial<DotMatrixCommonProps> =
        isTriangleMatrix && activeExampleId === "ex-opacity"
          ? EXAMPLE_EX_OPACITY_FOR_TRIANGLE
          : EXAMPLE_SNIPPET_PROPS[activeExampleId];
      const merged: DotMatrixCommonProps = { ...base, ...snippet };
      // Same on-screen scale as the default (large) detail preview, not the snippet’s size/dotSize
      merged.size = largeSize;
      merged.dotSize = largeDotSize;
      // Snippet is about fixed box/slot; left preview should match the default (no `boxSize` frame)
      delete merged.boxSize;
      delete merged.minSize;
      merged.speed = base.speed;
      merged.animated = base.animated;
      // `pattern` only applies to 5×5 square loaders; circular & triangle use fixed silhouttes.
      if (activeExampleId === "ex-look" && isSquareMatrix) {
        merged.pattern = "cross";
      } else {
        merged.pattern = base.pattern;
      }
      return (
        <SelectedComponent
          key={previewKey}
          {...merged}
        />
      );
    }

    return (
      <SelectedComponent
        key={previewKey}
        {...base}
        size={largeSize}
        dotSize={largeDotSize}
      />
    );
  }, [selected, activeExampleId]);

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="mb-10 sm:mb-20">
        <div className="mt-10 sm:mt-8 grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex  justify-between w-full sm:gap-4">

                <h1 className="theme-text-strong text-balance text-3xl tracking-tight sm:text-8xl">
                  <span className="block">
                    Dot{" "}
                    <span className="hidden sm:inline-block -mx-0.5 sm:-ml-1 sm:-mr-3 rotate-5 p-0.5 sm:p-1 bg-[#dfdfdf] rounded-md sm:rounded-[22px] size-[0.95em] translate-y-1 sm:translate-y-3" aria-hidden="true">
                      <Image
                        src="/icon.svg"
                        alt=""
                        width={200}
                        height={200}
                        className="size-full select-none"
                        draggable={false}
                        priority
                      />
                    </span>{" "}
                    matrix loaders for every app.
                  </span>
                </h1>
                <div className="flex w-max shrink-0 flex-col items-end gap-1 sm:gap-2 text-xs sm:text-2xl pt-1.5 sm:pt-4">
                  <Link href="/getting-started/introduction" className={heroNavLinkClassName}>
                    Introduction
                  </Link>
                  <Link href="/getting-started/usage" className={heroNavLinkClassName}>
                    Usage
                  </Link>
                  <Link href="/getting-started/manual" className={heroNavLinkClassName}>
                    Manual setup
                  </Link>
                </div>
              </div>
              <p className=" max-w-[65ch] text-pretty tracking-tight text-sm leading-relaxed  sm:text-2xl">
                55+ free and open-source loaders, built with React, TypeScript, Tailwind CSS, and shadcn.
                Install one, copy the code, and make it yours.
              </p>
            </div>
            <HeroInstallCommand />
          </div>
        </div>
      </section>

      <section
        id="loader-grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5"
      >
        {items.map((item) => (
          <LoaderGridCard
            key={item.slug}
            item={item}
            onSelect={handleSelectSlug}
            isAnimationEnabled={isCardAnimationEnabled}
          />
        ))}
      </section>

      <LoaderDetailsDrawer
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSlug(null);
            setActiveExampleId(null);
          }
        }}
        selected={selected}
        preview={selectedPreview}
        activeExamplePreviewId={activeExampleId}
        onExamplePreview={toggleExamplePreview}
      />
    </main>
  );
}
