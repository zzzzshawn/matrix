"use client";

import { DialStore, useDialKit } from "dialkit";
import { GeistSans } from "geist/font/sans";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CheckIcon, CopyClipboardIcon } from "@/components/package-manager-install-toolbar";
import { ShikiCodeView } from "@/components/shiki-code-view";
import {
  LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST,
  LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE
} from "@/components/loader-gallery-defaults";
import { loaderComponentMap } from "@/lib/loader-component-map";
import { LOADER_GALLERY_PREVIEW_PROPS } from "@/lib/loader-gallery-preview-props";
import {
  DotMatrixIcon,
  type DotMatrixColorPreset,
  type DotMatrixCommonProps,
  type DotShape,
  type MatrixPattern
} from "@/loaders";

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

const dotShapeOptions: { value: DotShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "diamond", label: "Diamond" },
  { value: "hearts", label: "Hearts" }
];

const DEFAULT_THEME_COLOR = "#f4f4f5";
const DEFAULT_COLOR_PRESET = "solid-theme";

const PLAYGROUND_COLOR_PRESETS = [
  { id: "solid-theme", label: "Theme", fill: "var(--color-dot-on)", glow: "var(--color-dot-on)" },
  { id: "solid-mint", label: "Mint", fill: "#34d399", glow: "#34d399" },
  {
    id: "grad-sunset",
    label: "Sunset",
    fill: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 52%, #ffe29a 100%)",
    glow: "#ff8b73"
  },
  {
    id: "grad-ocean",
    label: "Ocean",
    fill: "linear-gradient(140deg, #00c6ff 0%, #0072ff 48%, #4facfe 100%)",
    glow: "#2f8fff"
  },
  {
    id: "grad-neon",
    label: "Neon",
    fill: "linear-gradient(145deg, #b4ff39 0%, #39ffb6 46%, #00d4ff 100%)",
    glow: "#59ffc8"
  },
  {
    id: "grad-aurora",
    label: "Aurora",
    fill: "linear-gradient(145deg, #ff3cac 0%, #784ba0 45%, #2b86c5 100%)",
    glow: "#9c64bf"
  },
  {
    id: "grad-fire",
    label: "Fire",
    fill: "linear-gradient(145deg, #ff512f 0%, #dd2476 45%, #ffb347 100%)",
    glow: "#f96a5f"
  },
  {
    id: "grad-prism",
    label: "Prism",
    fill: "linear-gradient(145deg, #12c2e9 0%, #c471ed 45%, #f64f59 100%)",
    glow: "#9e7de8"
  }
] as const;

function clampOpacity(value: number | undefined, fallback: number) {
  return Math.min(1, Math.max(0, value ?? fallback));
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(2).replace(/\.?0+$/, "");
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
      colorPreset: {
        type: "select",
        default: DEFAULT_COLOR_PRESET,
        options: [
          { value: "custom", label: "Custom" },
          ...PLAYGROUND_COLOR_PRESETS.map((preset) => ({
            value: preset.id,
            label: preset.label
          }))
        ]
      },
      customColor: {
        type: "color",
        default: DEFAULT_THEME_COLOR
      },
      pattern: {
        type: "select",
        default: defaultProps.pattern ?? "full",
        options: patternOptions
      },
      dotShape: {
        type: "select",
        default: defaultProps.dotShape ?? "circle",
        options: dotShapeOptions
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
  const [snippetCopied, setSnippetCopied] = useState(false);
  const snippetCopyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCustomColorRef = useRef(controls.customColor);

  useEffect(() => {
    if (controls.customColor === prevCustomColorRef.current) {
      return;
    }

    prevCustomColorRef.current = controls.customColor;

    if (controls.colorPreset === "custom") {
      return;
    }

    const panel = DialStore.getPanels().find((entry) => entry.name === "Loader Playground");
    if (!panel) {
      return;
    }

    DialStore.updateValue(panel.id, "colorPreset", "custom");
  }, [controls.customColor, controls.colorPreset]);

  useEffect(() => {
    return () => {
      if (snippetCopyResetRef.current) {
        clearTimeout(snippetCopyResetRef.current);
      }
    };
  }, []);

  const selectedLoader = loaders.find((loader) => loader.slug === controls.loader) ?? loaders[0];
  const SelectedLoader =
    loaderComponentMap[selectedLoader?.slug ?? fallbackSlug] ?? loaderComponentMap[fallbackSlug] ?? DotMatrixIcon;
  const customColor =
    controls.customColor.toLowerCase() === DEFAULT_THEME_COLOR
      ? "var(--color-dot-on)"
      : controls.customColor;
  const resolvedColorPreset =
    controls.colorPreset === "custom" ? undefined : (controls.colorPreset as DotMatrixColorPreset);
  const props: DotMatrixCommonProps = {
    size: controls.size,
    dotSize: controls.dotSize,
    speed: controls.speed,
    color: customColor,
    ...(resolvedColorPreset ? { colorPreset: resolvedColorPreset } : {}),
    pattern: controls.pattern as MatrixPattern,
    dotShape: controls.dotShape as DotShape,
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

  const previewStyle = {
    transform: `scale(${controls.preview.zoom})`,
    transformOrigin: "center center"
  } as CSSProperties;
  const snippet = useMemo(() => {
    const componentName = selectedLoader?.componentName ?? "DotMatrixIcon";
    const propLines: string[] = [
      `size={${formatNumber(controls.size)}}`,
      `dotSize={${formatNumber(controls.dotSize)}}`,
      `speed={${formatNumber(controls.speed)}}`,
      `pattern="${controls.pattern}"`
    ];

    if (controls.dotShape !== "circle") {
      propLines.push(`dotShape="${controls.dotShape}"`);
    }

    if (resolvedColorPreset) {
      propLines.push(`colorPreset="${resolvedColorPreset}"`);
    } else {
      propLines.push(`color="${customColor}"`);
    }

    if (controls.states.animated) {
      propLines.push("animated");
    }
    if (controls.states.hoverAnimated) {
      propLines.push("hoverAnimated");
    }
    if (controls.states.muted) {
      propLines.push("muted");
    }
    if (controls.states.bloom) {
      propLines.push("bloom");
    }
    if (controls.states.halo > 0) {
      propLines.push(`halo={${formatNumber(controls.states.halo)}}`);
    }

    propLines.push(
      `opacityBase={${formatNumber(controls.opacity.base)}}`,
      `opacityMid={${formatNumber(controls.opacity.mid)}}`,
      `opacityPeak={${formatNumber(controls.opacity.peak)}}`
    );

    if (controls.layout.cellPadding > 0) {
      propLines.push(`cellPadding={${formatNumber(controls.layout.cellPadding)}}`);
    }
    if (controls.layout.boxSize > 0) {
      propLines.push(`boxSize={${formatNumber(controls.layout.boxSize)}}`);
    }
    if (controls.layout.minSize > 0) {
      propLines.push(`minSize={${formatNumber(controls.layout.minSize)}}`);
    }

    return `<${componentName}
  ${propLines.join("\n  ")}
/>`;
  }, [
    selectedLoader?.componentName,
    controls.size,
    controls.dotSize,
    controls.speed,
    controls.pattern,
    controls.dotShape,
    controls.states.animated,
    controls.states.hoverAnimated,
    controls.states.muted,
    controls.states.bloom,
    controls.states.halo,
    controls.opacity.base,
    controls.opacity.mid,
    controls.opacity.peak,
    controls.layout.cellPadding,
    controls.layout.boxSize,
    controls.layout.minSize,
    customColor,
    resolvedColorPreset
  ]);
  const copySnippet = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(snippet);
      setSnippetCopied(true);
      if (snippetCopyResetRef.current) {
        clearTimeout(snippetCopyResetRef.current);
      }
      snippetCopyResetRef.current = setTimeout(() => {
        setSnippetCopied(false);
        snippetCopyResetRef.current = null;
      }, 1400);
    } catch {
      // Ignore unsupported contexts.
    }
  }, [snippet]);

  return (
    <main className={`${GeistSans.className} mx-auto flex min-h-dvh w-full flex-1 flex-col p-2 `}>
      <div className="w-full">
        <section className="relative flex h-[98dvh] flex-col overflow-hidden rounded-lg bg-surface">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
            <div
              className="flex items-center justify-center will-change-transform"
              style={previewStyle}
            >
              <SelectedLoader
                key={`${selectedLoader?.slug}-${controls.pattern}-${controls.dotShape}-${controls.colorPreset}-${controls.customColor}`}
                {...props}
              />
            </div>
          </div>
          <div className="shrink-0 px-4 pb-4 absolute top-22 left-4">
            <div className="mx-auto w-max rounded-lg p-3">
              <div className="mb-2 flex justify-end absolute -top-6">
                <button
                  type="button"
                  onClick={() => void copySnippet()}
                  aria-label={snippetCopied ? "Copied" : "Copy snippet"}
                  className="inline-flex items-center justify-center rounded-md bg-surface-soft p-1.5 text-fg-strong transition-colors duration-150 ease-out hover:opacity-90"
                >
                  {snippetCopied ? (
                    <CheckIcon className="size-[16px]" />
                  ) : (
                    <CopyClipboardIcon className="size-[16px]" />
                  )}
                </button>
              </div>
              <ShikiCodeView
                code={snippet}
                lang="tsx"
                lineNumbers={false}
                className="text-xs sm:text-[13px] [&_.shiki]:!bg-transparent [&_.shiki]:![background-color:transparent]"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
