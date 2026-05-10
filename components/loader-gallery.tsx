"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  LoaderDetailsDrawer,
  type ExamplePreviewId
} from "@/components/loader-details-drawer";
import {
  LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST,
  LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE,
  LOADER_GALLERY_DEFAULT_HERO_CONTENT
} from "@/components/loader-gallery-defaults";
import {
  LOADER_GALLERY_EXAMPLE_SNIPPET_PROPS,
  LOADER_GALLERY_EX_OPACITY_FOR_TRIANGLE
} from "@/components/loader-gallery-example-props";
import { LoaderGalleryGridCard } from "@/components/loader-gallery-grid-card";
import type {
  LoaderGalleryProps,
  LoaderPreviewOverrideMap
} from "@/components/loader-gallery.types";
import { LoaderGalleryHeroInstallCommand } from "@/components/loader-gallery-hero-install-command";
import { loaderComponentMap } from "@/lib/loader-component-map";
import { ReducedMotionOverrideProvider } from "@/loaders/hooks/use-prefers-reduced-motion";
import { DotMatrixIcon, type DotMatrixColorPreset, type DotMatrixCommonProps } from "@/loaders";
import { LOADER_GALLERY_PREVIEW_PROPS } from "@/lib/loader-gallery-preview-props";

const heroNavLinkClassName =
  "text-fg-dim inline-block outline-offset-2 transition-[color,transform] duration-200 ease-out hover:text-link-hover focus-visible:text-link-hover motion-reduce:transition-colors";

const HOMEPAGE_COLOR_PRESETS = [
  { id: "solid-theme", label: "Theme", fill: "var(--color-dot-on)", glow: "var(--color-dot-on)", swatch: "var(--color-dot-on)" },
  { id: "solid-mint", label: "Mint", fill: "#34d399", glow: "#34d399", swatch: "#34d399" },
  {
    id: "grad-sunset",
    label: "Sunset",
    fill: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 52%, #ffe29a 100%)",
    glow: "#ff8b73",
    swatch: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 52%, #ffe29a 100%)"
  },
  {
    id: "grad-ocean",
    label: "Ocean",
    fill: "linear-gradient(140deg, #00c6ff 0%, #0072ff 48%, #4facfe 100%)",
    glow: "#2f8fff",
    swatch: "linear-gradient(140deg, #00c6ff 0%, #0072ff 48%, #4facfe 100%)"
  },
  {
    id: "grad-neon",
    label: "Neon",
    fill: "linear-gradient(145deg, #b4ff39 0%, #39ffb6 46%, #00d4ff 100%)",
    glow: "#59ffc8",
    swatch: "linear-gradient(145deg, #b4ff39 0%, #39ffb6 46%, #00d4ff 100%)"
  },
  {
    id: "grad-aurora",
    label: "Aurora",
    fill: "linear-gradient(145deg, #ff3cac 0%, #784ba0 45%, #2b86c5 100%)",
    glow: "#9c64bf",
    swatch: "linear-gradient(145deg, #ff3cac 0%, #784ba0 45%, #2b86c5 100%)"
  },
  {
    id: "grad-fire",
    label: "Fire",
    fill: "linear-gradient(145deg, #ff512f 0%, #dd2476 45%, #ffb347 100%)",
    glow: "#f96a5f",
    swatch: "linear-gradient(145deg, #ff512f 0%, #dd2476 45%, #ffb347 100%)"
  },
  {
    id: "grad-prism",
    label: "Prism",
    fill: "linear-gradient(145deg, #12c2e9 0%, #c471ed 45%, #f64f59 100%)",
    glow: "#9e7de8",
    swatch: "linear-gradient(145deg, #12c2e9 0%, #c471ed 45%, #f64f59 100%)"
  }
] as const;

function resolvePreviewProps(slug: string, overrides?: LoaderPreviewOverrideMap): DotMatrixCommonProps {
  const base =
    LOADER_GALLERY_PREVIEW_PROPS[slug] ?? LOADER_GALLERY_PREVIEW_PROPS["dotm-square-1"];
  const override = overrides?.[slug];
  return override ? { ...base, ...override } : base;
}

export function LoaderGallery({
  items,
  heroContent,
  cardAnimationEnabled = true, detailPreviewScale = LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE,
  detailPreviewDotBoost = LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST,
  previewPropsOverrides,
  className
}: LoaderGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeExampleId, setActiveExampleId] = useState<ExamplePreviewId | null>(null);
  const [activeColorPresetId, setActiveColorPresetId] = useState<string>(HOMEPAGE_COLOR_PRESETS[0].id);
  const [hoveredColorPresetId, setHoveredColorPresetId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const handleSelectSlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);
  const resolvedHero = {
    title: heroContent?.title ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.title,
    description: heroContent?.description ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.description,
    navLinks: heroContent?.navLinks ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.navLinks,
    installCommand: heroContent?.installCommand ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.installCommand
  };
  const firstLoaderSlug = items[0]?.slug ?? "dotm-square-1";

  const selected = useMemo(
    () => items.find((item) => item.slug === selectedSlug) ?? null,
    [items, selectedSlug]
  );
  const activeColorPreset =
    HOMEPAGE_COLOR_PRESETS.find((preset) => preset.id === activeColorPresetId) ?? HOMEPAGE_COLOR_PRESETS[0];

  const toggleExamplePreview = useCallback((id: ExamplePreviewId) => {
    setActiveExampleId((p) => (p === id ? null : id));
  }, []);

  useEffect(() => {
    setActiveExampleId(null);
  }, [selected?.slug]);

  const selectedPreview = useMemo(() => {
    if (!selected) {
      return (
        <ReducedMotionOverrideProvider reducedMotion={false}>
          <DotMatrixIcon />
        </ReducedMotionOverrideProvider>
      );
    }

    const SelectedComponent = loaderComponentMap[selected.slug] ?? DotMatrixIcon;
    const base: DotMatrixCommonProps = {
      ...resolvePreviewProps(selected.slug, previewPropsOverrides),
      colorPreset: activeColorPreset.id as DotMatrixColorPreset
    };
    const detailSize = base.size ?? 30;
    const detailDotSize = base.dotSize ?? 4;
    const largeSize = Math.round(detailSize * detailPreviewScale);
    const largeDotSize = detailDotSize + detailPreviewDotBoost;
    const previewKey = `${selected.slug}-${activeExampleId ?? "default"}`;
    const isSquareMatrix = selected.slug.startsWith("dotm-square-");
    const isTriangleMatrix = selected.slug.startsWith("dotm-triangle-");

    if (activeExampleId) {
      // DotMatrixBase `cellPadding` / `boxSize` only apply to square & circular; triangle
      // uses a 7×7 hand-built grid, so the layout example is not shown in the UI.
      if (activeExampleId === "ex-layout" && isTriangleMatrix) {
        return (
          <ReducedMotionOverrideProvider reducedMotion={false}>
            <SelectedComponent
              key={previewKey}
              {...base}
              size={largeSize}
              dotSize={largeDotSize}
            />
          </ReducedMotionOverrideProvider>
        );
      }
      const snippet: Partial<DotMatrixCommonProps> =
        isTriangleMatrix && activeExampleId === "ex-opacity"
          ? LOADER_GALLERY_EX_OPACITY_FOR_TRIANGLE
          : LOADER_GALLERY_EXAMPLE_SNIPPET_PROPS[activeExampleId];
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
        <ReducedMotionOverrideProvider reducedMotion={false}>
          <SelectedComponent
            key={previewKey}
            {...merged}
          />
        </ReducedMotionOverrideProvider>
      );
    }

    return (
      <ReducedMotionOverrideProvider reducedMotion={false}>
        <SelectedComponent
          key={previewKey}
          {...base}
          size={largeSize}
          dotSize={largeDotSize}
        />
      </ReducedMotionOverrideProvider>
    );
  }, [selected, activeExampleId, previewPropsOverrides, detailPreviewScale, detailPreviewDotBoost, activeColorPreset.id]);

  return (
    <main
      className={`relative mx-auto min-h-dvh w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 flex flex-col gap-6 lg:gap-10 lg:px-8${className ? ` ${className}` : ""}`}
    >
      <section className="">
        <div className="mt-10 sm:mt-8 grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex  justify-between w-full sm:gap-4">

                <h1 className="theme-text-strong text-balance text-3xl tracking-tight sm:text-8xl">
                  {resolvedHero.title}
                </h1>
                <div className="flex w-max shrink-0 flex-col items-end gap-1 sm:gap-2 text-xs sm:text-2xl pt-1.5 sm:pt-4">
                  {resolvedHero.navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={heroNavLinkClassName}>
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={`/playground?loader=${encodeURIComponent(firstLoaderSlug)}`}
                    className={heroNavLinkClassName}
                  >
                    Playground
                  </Link>
                </div>
              </div>
              <p className=" max-w-[65ch] text-pretty tracking-tight text-sm leading-relaxed  sm:text-2xl">
                {resolvedHero.description}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <LoaderGalleryHeroInstallCommand installCommand={resolvedHero.installCommand} />
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <LayoutGroup id="homepage-color-presets">
          <div className="flex items-center gap-0">
            {HOMEPAGE_COLOR_PRESETS.map((preset) => {
              const active = preset.id === activeColorPreset.id;
              const highlight =
                hoveredColorPresetId !== null ? hoveredColorPresetId === preset.id : active;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveColorPresetId(preset.id)}
                  onMouseEnter={() => setHoveredColorPresetId(preset.id)}
                  onMouseLeave={() => setHoveredColorPresetId(null)}
                  aria-label={`Use ${preset.label} preset`}
                  aria-pressed={active}
                  className="relative inline-flex items-center justify-center rounded-lg p-2"
                >
                  {highlight ? (
                    <motion.span
                      layoutId="homepage-color-preset-highlight"
                      className="absolute inset-0 rounded-lg bg-preset"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 520, damping: 38 }
                      }
                    />
                  ) : null}
                  <span
                    className="relative z-10 size-5 lg:size-7 rounded-full border border-white/20"
                    style={{ background: preset.swatch }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </section>

      <section
        id="loader-grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5"
      >
        {items.map((item) => (
          <LoaderGalleryGridCard
            key={item.slug}
            item={item}
            onSelect={handleSelectSlug}
            isAnimationEnabled={cardAnimationEnabled}
            PreviewComponent={loaderComponentMap[item.slug] ?? DotMatrixIcon}
            previewProps={{
              ...resolvePreviewProps(item.slug, previewPropsOverrides),
              colorPreset: activeColorPreset.id as DotMatrixColorPreset
            }}
            ignoreReducedMotion
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
