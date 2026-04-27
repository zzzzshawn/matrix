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
import { LOADER_GALLERY_PREVIEW_PROPS } from "@/lib/loader-gallery-preview-props";

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

    const SelectedComponent = componentMap[selected.slug as keyof typeof componentMap] ?? DotMatrixIcon;
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
            PreviewComponent={componentMap[item.slug as keyof typeof componentMap] ?? DotMatrixIcon}
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
