"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AudioBarsMatrix,
  BraillePatternMatrix,
  CenterOriginRippleMatrix,
  CircularArcCascadeMatrix,
  CircularBrailleCheckerShiftMatrix,
  CircularBrailleClusterMatrix,
  CircularBrailleGlyphCycleMatrix,
  CircularBrailleOrbitCellsMatrix,
  CircularBraillePulsePairMatrix,
  CircularBrailleScanlineMatrix,
  CircularBinaryBloomMatrix,
  CircularConstellationMatrix,
  CircularColumnSnakeMatrix,
  CircularDnaRungShiftMatrix,
  CircularDnaTwinHelixMatrix,
  CircularGateFlipMatrix,
  CircularHeartbeatMatrix,
  CircularMobiusStripMatrix,
  CircularPhaseOrbitMatrix,
  CircularPinwheelMatrix,
  CircularQuadrantBreatheMatrix,
  CircularRadarSweepMatrix,
  CircularTripleSnakeMatrix,
  ColumnSnakeMatrix,
  ColumnStaggerBlinkMatrix,
  DiagonalSnakeMatrix,
  DiagonalTrBlSweepMatrix,
  DigitalCounterMatrix,
  DotMatrixIcon,
  DnaHalfHelixMatrix,
  DnaHelixCompactMatrix,
  DnaHelixMatrix,
  KaleidoscopeMatrix,
  InfinityLoopMatrix,
  MobiusStripMatrix,
  PhosphorSweepMatrix,
  RippleEchoMatrix,
  RowWaveMatrix,
  SpiralSnakeMatrix,
  TetrisStackMatrix,
  TriangleAltitudePulseMatrix,
  TriangleCenterSpokesMatrix,
  TriangleCornerBounceMatrix,
  TriangleRowScanMatrix,
  TriangleVertexChaseMatrix,
  TripleSnakeMatrix,
  type DotMatrixCommonProps
} from "@/loaders";

interface LoaderCard {
  slug: string;
  title: string;
  description: string;
  componentName: string;
  motionOptional: boolean;
  sourceCode: string;
}

interface LoaderGalleryProps {
  items: LoaderCard[];
}

const componentMap = {
  "diagonal-trbl-sweep-matrix": DiagonalTrBlSweepMatrix,
  "row-wave-matrix": RowWaveMatrix,
  "spiral-snake-matrix": SpiralSnakeMatrix,
  "triple-snake-matrix": TripleSnakeMatrix,
  "diagonal-snake-matrix": DiagonalSnakeMatrix,
  "column-snake-matrix": ColumnSnakeMatrix,
  "tetris-stack-matrix": TetrisStackMatrix,
  "column-stagger-blink-matrix": ColumnStaggerBlinkMatrix,
  "braille-pattern-matrix": BraillePatternMatrix,
  "phosphor-sweep-matrix": PhosphorSweepMatrix,
  "ripple-echo-matrix": RippleEchoMatrix,
  "center-origin-ripple-matrix": CenterOriginRippleMatrix,
  "digital-counter-matrix": DigitalCounterMatrix,
  "kaleidoscope-matrix": KaleidoscopeMatrix,
  "dna-helix-matrix": DnaHelixMatrix,
  "dna-helix-compact-matrix": DnaHelixCompactMatrix,
  "dna-half-helix-matrix": DnaHalfHelixMatrix,
  "audio-bars-matrix": AudioBarsMatrix,
  "infinity-loop-matrix": InfinityLoopMatrix,
  "mobius-strip-matrix": MobiusStripMatrix,
  "circular-column-snake-matrix": CircularColumnSnakeMatrix,
  "circular-constellation-matrix": CircularConstellationMatrix,
  "circular-binary-bloom-matrix": CircularBinaryBloomMatrix,
  "circular-triple-snake-matrix": CircularTripleSnakeMatrix,
  "circular-mobius-strip-matrix": CircularMobiusStripMatrix,
  "circular-radar-sweep-matrix": CircularRadarSweepMatrix,
  "circular-pinwheel-matrix": CircularPinwheelMatrix,
  "circular-phase-orbit-matrix": CircularPhaseOrbitMatrix,
  "circular-gate-flip-matrix": CircularGateFlipMatrix,
  "circular-heartbeat-matrix": CircularHeartbeatMatrix,
  "circular-quadrant-breathe-matrix": CircularQuadrantBreatheMatrix,
  "circular-arc-cascade-matrix": CircularArcCascadeMatrix,
  "circular-dna-twin-helix-matrix": CircularDnaTwinHelixMatrix,
  "circular-dna-rung-shift-matrix": CircularDnaRungShiftMatrix,
  "circular-braille-cluster-matrix": CircularBrailleClusterMatrix,
  "circular-braille-scanline-matrix": CircularBrailleScanlineMatrix,
  "circular-braille-checker-shift-matrix": CircularBrailleCheckerShiftMatrix,
  "circular-braille-pulse-pair-matrix": CircularBraillePulsePairMatrix,
  "circular-braille-orbit-cells-matrix": CircularBrailleOrbitCellsMatrix,
  "circular-braille-glyph-cycle-matrix": CircularBrailleGlyphCycleMatrix,
  "triangle-center-spokes-matrix": TriangleCenterSpokesMatrix,
  "triangle-altitude-pulse-matrix": TriangleAltitudePulseMatrix,
  "triangle-corner-bounce-matrix": TriangleCornerBounceMatrix,
  "triangle-vertex-chase-matrix": TriangleVertexChaseMatrix,
  "triangle-row-scan-matrix": TriangleRowScanMatrix
};

const previewSpeed = 1.35;

const previewPropsMap: Record<string, DotMatrixCommonProps> = {
  "diagonal-trbl-sweep-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.1 },
  "row-wave-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.15 },
  "spiral-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "triple-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.35 },
  "diagonal-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "column-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.2 },
  "tetris-stack-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "column-stagger-blink-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.4 },
  "braille-pattern-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.5 },
  "phosphor-sweep-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "ripple-echo-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "center-origin-ripple-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: previewSpeed },
  "digital-counter-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.85 },
  "kaleidoscope-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "dna-helix-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.25 },
  "dna-helix-compact-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "dna-half-helix-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "audio-bars-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.35 },
  "infinity-loop-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.45 },
  "mobius-strip-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.45 },
  "circular-column-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 2.5 },
  "circular-constellation-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 5.55 },
  "circular-binary-bloom-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "circular-triple-snake-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.8 },
  "circular-mobius-strip-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "circular-radar-sweep-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "circular-pinwheel-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.7 },
  "circular-phase-orbit-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "circular-gate-flip-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.8 },
  "circular-heartbeat-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.95 },
  "circular-quadrant-breathe-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.65 },
  "circular-arc-cascade-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.7 },
  "circular-dna-twin-helix-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "circular-dna-rung-shift-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "circular-braille-cluster-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.65 },
  "circular-braille-scanline-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.1 },
  "circular-braille-checker-shift-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.55 },
  "circular-braille-pulse-pair-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.75 },
  "circular-braille-orbit-cells-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.6 },
  "circular-braille-glyph-cycle-matrix": { size: 30, dotSize: 4, pattern: "full", animated: true, speed: 1.5 },
  "triangle-center-spokes-matrix": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 5 },
  "triangle-altitude-pulse-matrix": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "triangle-corner-bounce-matrix": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.45 },
  "triangle-vertex-chase-matrix": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.5 },
  "triangle-row-scan-matrix": { size: 24, dotSize: 5, pattern: "full", animated: true, speed: 1.8 }
};

export function LoaderGallery({ items }: LoaderGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://your-docs-domain.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }


    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSlug(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedSlug]);

  const selected = useMemo(
    () => items.find((item) => item.slug === selectedSlug) ?? null,
    [items, selectedSlug]
  );

  const installUrl = selected ? `${origin}/r/${selected.slug}.json` : "";
  const installCommand = `npx shadcn@latest add ${installUrl}`;

  return (
    <main className="relative mx-auto min-h-[100dvh] w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="mb-8 rounded-[1.75rem] border border-white/10 bg-[var(--surface)]/50 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Dotmatrix loader library</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              Minimal dotmatrix loaders, ready for shadcn
            </h1>
            <p className="mt-4 max-w-[65ch] text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
              Single page gallery. Click any loader card to open install steps and manual source in a
              focused modal.
            </p>
          </div>
          <a
            href="#loader-grid"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-zinc-100 transition-[transform,background-color,border-color] duration-200 hover:border-white/25 hover:bg-white/10 active:scale-[0.96]"
          >
            Browse loaders
          </a>
        </div>
      </section>

      <section
        id="loader-grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5"
      >
        {items.map((item) => {
          const Component = componentMap[item.slug as keyof typeof componentMap] ?? DotMatrixIcon;
          const previewProps = previewPropsMap[item.slug] ?? previewPropsMap["dot-matrix-icon"];

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSelectedSlug(item.slug)}
              className="group relative min-h-[176px] rounded-2xl text-left shadow-[0_1px_0_rgba(255,255,255,0.04)] outline-none transition-[transform,background-color,border-color] duration-200 hover:-translate-y-[1px] hover:border-white/20 hover:bg-zinc-900 focus-visible:border-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-600/40 active:scale-[0.98]"
            >
              <div className="relative flex h-full flex-col">
                <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 ">
                  <Component {...previewProps} />
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedSlug(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} installation details`}
            onClick={(event) => event.stopPropagation()}
            className="modal-shell max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)] shadow-[0_22px_70px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Loader</p>
                <h2 className="mt-1 text-2xl font-semibold text-zinc-100">{selected.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm text-zinc-300 transition-[transform,background-color] duration-200 hover:bg-white/10 active:scale-[0.96]"
              >
                Close
              </button>
            </div>

            <div className="grid max-h-[calc(92vh-84px)] gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-2">
              <section className="grid content-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-200">
                  Registry Install
                </h3>
                <p className="text-sm text-zinc-400">{selected.description}</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-100">
                  <code>{installCommand}</code>
                </pre>
              </section>

              <section className="grid content-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-200">
                  Manual Usage
                </h3>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-100">
                  <code>{`import { ${selected.componentName} } from "@/components/ui/${selected.slug}";

export function Example() {
  return <${selected.componentName} />;
}`}</code>
                </pre>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                  Source snippet for copy/paste
                </p>
                <pre className="max-h-[300px] overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-100">
                  <code>{selected.sourceCode}</code>
                </pre>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
