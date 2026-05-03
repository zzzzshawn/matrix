"use client";

import { useDialKit } from "dialkit";
import { GeistSans } from "geist/font/sans";
import { useMemo } from "react";
import {
  LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST,
  LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE
} from "@/components/loader-gallery-defaults";
import { loaderComponentMap } from "@/lib/loader-component-map";
import { LOADER_GALLERY_PREVIEW_PROPS } from "@/lib/loader-gallery-preview-props";
import { DotMatrixIcon, type DotMatrixCommonProps, type MatrixPattern } from "@/loaders";

interface PlaygroundLoaderOption {
  slug: string;
  title: string;
  componentName: string;
}

interface PlaygroundClientProps {
  initialSlug?: string;
  loaders: PlaygroundLoaderOption[];
}

const patternOptions: { value: MatrixPattern; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "diamond", label: "Diamond" },
  { value: "outline", label: "Outline" },
  { value: "cross", label: "Cross" },
  { value: "rings", label: "Rings" },
  { value: "rose", label: "Rose" }
];

const DEFAULT_THEME_COLOR = "#f4f4f5";

function clampOpacity(value: number | undefined, fallback: number) {
  return Math.min(1, Math.max(0, value ?? fallback));
}

export function PlaygroundClient({ initialSlug, loaders }: PlaygroundClientProps) {
  const fallbackSlug = loaders[0]?.slug ?? "dotm-square-1";
  const defaultSlug = loaders.some((loader) => loader.slug === initialSlug)
    ? initialSlug ?? fallbackSlug
    : fallbackSlug;
  const defaultProps = LOADER_GALLERY_PREVIEW_PROPS[defaultSlug] ?? LOADER_GALLERY_PREVIEW_PROPS[fallbackSlug];
  const loaderSelectOptions = useMemo(
    () =>
      loaders.map((loader) => ({
        value: loader.slug,
        label: loader.title
      })),
    [loaders]
  );

  const controls = useDialKit(
    "Loader Playground",
    {
      loader: {
        type: "select",
        default: defaultSlug,
        options: loaderSelectOptions
      },
      size: [
        Math.round((defaultProps.size ?? 30) * LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE),
        18,
        220,
        1
      ],
      dotSize: [
        Number(((defaultProps.dotSize ?? 4) + LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST).toFixed(1)),
        1,
        22,
        0.5
      ],
      speed: [defaultProps.speed ?? 1.2, 0.1, 7, 0.05],
      color: {
        type: "color",
        default: DEFAULT_THEME_COLOR
      },
      pattern: {
        type: "select",
        default: defaultProps.pattern ?? "full",
        options: patternOptions
      },
      states: {
        _collapsed: false,
        animated: defaultProps.animated ?? true,
        hoverAnimated: false,
        muted: false,
        bloom: defaultProps.bloom ?? false,
        halo: [defaultProps.halo ?? 0, 0, 1, 0.01]
      },
      opacity: {
        _collapsed: false,
        base: [clampOpacity(defaultProps.opacityBase, 0.12), 0, 1, 0.01],
        mid: [clampOpacity(defaultProps.opacityMid, 0.42), 0, 1, 0.01],
        peak: [clampOpacity(defaultProps.opacityPeak, 1), 0, 1, 0.01]
      },
      preview: {
        zoom: [1, 0.75, 4, 0.05]
      },
      layout: {
        _collapsed: true,
        cellPadding: [defaultProps.cellPadding ?? 0, 0, 28, 0.5],
        boxSize: [0, 0, 280, 1],
        minSize: [0, 0, 280, 1]
      }
    },
    {
      shortcuts: {
        size: { key: "s", interaction: "drag" },
        dotSize: { key: "d", interaction: "drag", mode: "fine" },
        speed: { key: "v", interaction: "scroll", mode: "fine" }
      }
    }
  );

  const selectedLoader = loaders.find((loader) => loader.slug === controls.loader) ?? loaders[0];
  const SelectedLoader =
    loaderComponentMap[selectedLoader?.slug ?? fallbackSlug] ?? loaderComponentMap[fallbackSlug] ?? DotMatrixIcon;
  const loaderColor =
    controls.color.toLowerCase() === DEFAULT_THEME_COLOR ? "var(--color-dot-on)" : controls.color;
  const props: DotMatrixCommonProps = {
    size: controls.size,
    dotSize: controls.dotSize,
    speed: controls.speed,
    color: loaderColor,
    pattern: controls.pattern as MatrixPattern,
    animated: controls.states.animated,
    hoverAnimated: controls.states.hoverAnimated,
    muted: controls.states.muted,
    bloom: controls.states.bloom,
    ...(controls.states.halo > 0 ? { halo: controls.states.halo } : {}),
    opacityBase: controls.opacity.base,
    opacityMid: controls.opacity.mid,
    opacityPeak: controls.opacity.peak
  };

  if (controls.layout.cellPadding > 0) {
    props.cellPadding = controls.layout.cellPadding;
  }

  if (controls.layout.boxSize > 0) {
    props.boxSize = controls.layout.boxSize;
  }

  if (controls.layout.minSize > 0) {
    props.minSize = controls.layout.minSize;
  }

  return (
    <main className={`${GeistSans.className} mx-auto flex min-h-dvh w-full flex-1 flex-col p-2 `}>
      <div className="w-full">
        <section className="relative flex h-[98dvh] overflow-hidden rounded-lg bg-surface">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
            <div
              className="flex items-center justify-center will-change-transform"
              style={{
                transform: `scale(${controls.preview.zoom})`,
                transformOrigin: "center center"
              }}
            >
              <SelectedLoader
                key={`${selectedLoader?.slug}-${controls.pattern}`}
                {...props}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
