"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LoaderDetailsDrawer,
  type ExamplePreviewId,
  type LoaderCard
} from "@/components/loader-details-drawer";

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
  "dotm-triangle-6": DotmTriangle6
};

const previewSpeed = 1.35;

const previewPropsMap: Record<string, DotMatrixCommonProps> = {
  "dotm-square-1": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.1 },
  "dotm-square-2": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.15 },
  "dotm-square-3": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-4": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.35 },
  "dotm-square-5": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-6": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.2 },
  "dotm-square-7": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-8": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.4 },
  "dotm-square-9": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.5 },
  "dotm-square-10": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-11": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-12": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "dotm-square-13": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.85 },
  "dotm-square-14": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-15": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "dotm-square-16": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-17": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "dotm-square-18": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.35 },
  "dotm-square-19": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.45 },
  "dotm-square-20": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.45 },
  "dotm-circular-1": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "dotm-circular-2": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.8 },
  "dotm-circular-3": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-4": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-5": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.7 },
  "dotm-circular-6": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-7": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.8 },
  "dotm-circular-8": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.95 },
  "dotm-circular-9": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 5.55 },
  "dotm-circular-10": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-11": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.65 },
  "dotm-circular-12": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.7 },
  "dotm-circular-13": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-14": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-15": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.65 },
  "dotm-circular-16": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.1 },
  "dotm-circular-17": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "dotm-circular-18": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "dotm-circular-19": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "dotm-circular-20": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-1": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 5 },
  "dotm-triangle-2": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-3": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.45 },
  "dotm-triangle-4": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "dotm-triangle-5": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.8 },
  "dotm-triangle-6": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 2.2 }
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

export function LoaderGallery({ items }: LoaderGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeExampleId, setActiveExampleId] = useState<ExamplePreviewId | null>(null);

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
      <section className="mb-20">
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex  justify-baseline gap-4">

                <h1 className="theme-text-strong text-balance text-3xl tracking-tight sm:text-9xl">
                  Dot matrix{" "}
                  {" "}
                  loaders for React
                </h1>
                <div className="theme-text-dim flex w-max shrink-0 flex-col items-end gap-2 text-xs sm:text-2xl">
                  <Link
                    href="/getting-started/introduction"
                    className="theme-link"
                  >
                    Introduction
                  </Link>
                  <Link
                    href="/getting-started/usage"
                    className="theme-link"
                  >
                    Usage
                  </Link>
                  <Link
                    href="/getting-started/manual"
                    className="theme-link"
                  >
                    Manual setup
                  </Link>
                </div>
              </div>
              <p className=" max-w-[65ch] text-pretty tracking-tight text-sm leading-relaxed  sm:text-2xl">
                This site is a gallery of dotmatrix-style loading components. Open a card for the shadcn add
                command and source files.
              </p>
            </div>
            <p className="">npx shadcn@latest add @dotmatrix/dotm-square-3</p>
          </div>
        </div>
      </section>

      <section
        id="loader-grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5"
      >
        {items.map((item) => {
          const Component = componentMap[item.slug as keyof typeof componentMap] ?? DotMatrixIcon;
          const previewProps = previewPropsMap[item.slug] ?? previewPropsMap["dotm-square-1"];

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSelectedSlug(item.slug)}
              className="aspect-square  relative group"
            >
              <div
                style={{
                  maskImage: "var(--loader-mask-a)",
                  boxShadow: "var(--loader-card-frame-shadow)"
                }}
                className="absolute inset-0 size-full transition-shadow duration-50 ease-out group-hover:[box-shadow:var(--loader-card-frame-shadow-hover)]"></div>
              <div
                style={{
                  maskImage: "var(--loader-mask-b)",
                  boxShadow: "var(--loader-card-frame-shadow)"
                }}
                className="absolute inset-0 z-10 size-full transition-shadow duration-50 ease-out group-hover:[box-shadow:var(--loader-card-frame-shadow-hover)]"></div>
              <div
                style={{
                  maskImage: "var(--loader-mask-c)",
                  boxShadow: "var(--loader-card-inner-shadow)"
                }}
                className="absolute inset-3 z-10 transition-shadow duration-50 ease-out"></div>

              <div className="theme-text-strong pointer-events-none absolute inset-x-2 bottom-2 z-20 rounded-md px-2 py-1 text-center text-[11px] font-medium tracking-wide">
                {item.title}
              </div>

              <div className="relative flex h-full flex-col">
                <div className="flex flex-1 items-center justify-center ">
                  <Component {...previewProps} />
                </div>
              </div>
            </button>
          );
        })}
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
