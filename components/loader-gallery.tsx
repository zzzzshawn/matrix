"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DotMatrixIcon, type DotMatrixCommonProps } from "@/loaders";
import { LOADER_GALLERY_PREVIEW_PROPS } from "@/lib/loader-gallery-preview-props";

const heroNavLinkClassName =
  "text-fg-dim inline-block outline-offset-2 transition-[color,transform] duration-200 ease-out hover:text-link-hover focus-visible:text-link-hover motion-reduce:transition-colors";

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
  const handleSelectSlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);
  const resolvedHero = {
    title: heroContent?.title ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.title,
    description: heroContent?.description ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.description,
    navLinks: heroContent?.navLinks ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.navLinks,
    installCommand: heroContent?.installCommand ?? LOADER_GALLERY_DEFAULT_HERO_CONTENT.installCommand
  };

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

    const SelectedComponent = loaderComponentMap[selected.slug] ?? DotMatrixIcon;
    const base: DotMatrixCommonProps = resolvePreviewProps(selected.slug, previewPropsOverrides);
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
  }, [selected, activeExampleId, previewPropsOverrides, detailPreviewScale, detailPreviewDotBoost]);

  return (
    <main
      className={`relative mx-auto min-h-dvh w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8${className ? ` ${className}` : ""}`}
    >
      <section className="mb-10 sm:mb-20">
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
                </div>
              </div>
              <p className=" max-w-[65ch] text-pretty tracking-tight text-sm leading-relaxed  sm:text-2xl">
                {resolvedHero.description}
              </p>
            </div>
            <LoaderGalleryHeroInstallCommand installCommand={resolvedHero.installCommand} />
          </div>
        </div>
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
            previewProps={resolvePreviewProps(item.slug, previewPropsOverrides)}
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
