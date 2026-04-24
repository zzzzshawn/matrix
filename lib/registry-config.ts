export interface LoaderRegistryEntry {
  slug: string;
  title: string;
  description: string;
  componentName: string;
  fileName: string;
  dependencies: string[];
  motionOptional: boolean;
}

export const loaderRegistry: LoaderRegistryEntry[] = [
  {
    slug: "diagonal-trbl-sweep-matrix",
    title: "Diagonal TR–BL",
    description: "Same ripple family as the icon, with a wave that sweeps from the top-right toward the bottom-left.",
    componentName: "DiagonalTrBlSweepMatrix",
    fileName: "diagonal-trbl-sweep-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "row-wave-matrix",
    title: "Row Wave",
    description:
      "Clockwise snake route: starts bottom-left up column 1, jumps to column 3 down, then column 2 up, and continues the same cycle to the right.",
    componentName: "RowWaveMatrix",
    fileName: "row-wave-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "spiral-snake-matrix",
    title: "Spiral Snake",
    description: "A 4-dot tail spirals clockwise from the outer border toward the center of the 5x5 grid.",
    componentName: "SpiralSnakeMatrix",
    fileName: "spiral-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triple-snake-matrix",
    title: "Triple Snake",
    description:
      "Outer ring snake moves clockwise, middle ring snake moves anticlockwise, and the center dot stays inactive.",
    componentName: "TripleSnakeMatrix",
    fileName: "triple-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "diagonal-snake-matrix",
    title: "Diagonal Snake",
    description: "Snake-style trail that traverses the 5x5 grid on alternating diagonals.",
    componentName: "DiagonalSnakeMatrix",
    fileName: "diagonal-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "column-snake-matrix",
    title: "Column Snake",
    description: "Five simultaneous snakes: columns 1/3/5 move up while columns 2/4 move down.",
    componentName: "ColumnSnakeMatrix",
    fileName: "column-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "tetris-stack-matrix",
    title: "Tetris Stack",
    description: "Tetromino-like frames drop and stack in a 5x5 matrix, then flash a row-clear beat.",
    componentName: "TetrisStackMatrix",
    fileName: "tetris-stack-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "column-stagger-blink-matrix",
    title: "Column Stagger Blink",
    description:
      "Each column stacks upward on a stagger (Tetris-style), the full grid blinks twice, then columns drain downward with the same stagger.",
    componentName: "ColumnStaggerBlinkMatrix",
    fileName: "column-stagger-blink-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "braille-pattern-matrix",
    title: "Braille Pattern",
    description:
      "Two synced 2×3 cells (Unicode dot order) step through clear motifs: rails, full grid, three rows, checker, horseshoes, and alternating columns.",
    componentName: "BraillePatternMatrix",
    fileName: "braille-pattern-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "phosphor-sweep-matrix",
    title: "Phosphor Sweep",
    description:
      "A CRT-style horizontal scanline moves down the matrix; swept rows leave a soft phosphor trail with a slight column-wise warp.",
    componentName: "PhosphorSweepMatrix",
    fileName: "phosphor-sweep-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "ripple-echo-matrix",
    title: "Ripple Echo",
    description: "Concentric diamond ripple with a soft secondary echo pulse per ring.",
    componentName: "RippleEchoMatrix",
    fileName: "ripple-echo-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "center-origin-ripple-matrix",
    title: "Center Origin Ripple",
    description: "Ripple starts at cell (2,2) and expands outward in concentric rings.",
    componentName: "CenterOriginRippleMatrix",
    fileName: "center-origin-ripple-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "digital-counter-matrix",
    title: "Digital Counter",
    description: "Single fan blade rotating around a center hub for a clean, readable loop.",
    componentName: "DigitalCounterMatrix",
    fileName: "digital-counter-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "kaleidoscope-matrix",
    title: "Kaleidoscope",
    description: "A symmetric kaleidoscope bloom cycling through clean radial motifs.",
    componentName: "KaleidoscopeMatrix",
    fileName: "kaleidoscope-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dna-helix-matrix",
    title: "DNA Helix",
    description: "Two mirrored strands with periodic bridges pulse like a compact DNA helix.",
    componentName: "DnaHelixMatrix",
    fileName: "dna-helix-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dna-helix-compact-matrix",
    title: "DNA Helix Compact",
    description: "A narrower helix variant that stays in the center band while preserving strand/rung rhythm.",
    componentName: "DnaHelixCompactMatrix",
    fileName: "dna-helix-compact-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dna-half-helix-matrix",
    title: "DNA Half Helix",
    description: "Single-strand helix variant that shows one side of the DNA wave.",
    componentName: "DnaHalfHelixMatrix",
    fileName: "dna-half-helix-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "audio-bars-matrix",
    title: "Audio Bars",
    description: "Equalizer-style vertical bars that pulse like live music levels.",
    componentName: "AudioBarsMatrix",
    fileName: "audio-bars-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "infinity-loop-matrix",
    title: "Infinity Loop",
    description: "Dual counter-rotating heads trace a figure-eight with a soft crossover pulse at center.",
    componentName: "InfinityLoopMatrix",
    fileName: "infinity-loop-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "mobius-strip-matrix",
    title: "Mobius Strip",
    description:
      "A bright head and tail run around the outer ring; a dimmer second train stays half a lap behind, with inner corner flashes for the twist.",
    componentName: "MobiusStripMatrix",
    fileName: "mobius-strip-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-column-snake-matrix",
    title: "Circular Diagonal Half Helix",
    description:
      "A circular-masked half-helix that travels diagonally from top-left to bottom-right with a bright strand and soft adjacent trail.",
    componentName: "CircularColumnSnakeMatrix",
    fileName: "circular-column-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-triple-snake-matrix",
    title: "Circular Tri-Orbit",
    description:
      "Three luminous heads orbit the circular ring at equal offsets, creating a triad chase that never overlaps into the old snake rhythm.",
    componentName: "CircularTripleSnakeMatrix",
    fileName: "circular-triple-snake-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-mobius-strip-matrix",
    title: "Circular Plasma Weave",
    description:
      "A plasma-like diagonal sweep and pulsing core weave through the circular mask for a distinctly different motion signature.",
    componentName: "CircularMobiusStripMatrix",
    fileName: "circular-mobius-strip-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-radar-sweep-matrix",
    title: "Circular Radar Sweep",
    description:
      "A rotating radar arm scans the circular grid with a bright beam front, soft wake, and faint perimeter ring echo.",
    componentName: "CircularRadarSweepMatrix",
    fileName: "circular-radar-sweep-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-pinwheel-matrix",
    title: "Circular Pinwheel",
    description:
      "Four rotating pinwheel blades spin through the circular matrix with a glowing center and soft trailing halo.",
    componentName: "CircularPinwheelMatrix",
    fileName: "circular-pinwheel-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-phase-orbit-matrix",
    title: "Circular Phase Orbit",
    description:
      "An off-center orbiting energy point traces a phase-shifted loop, creating a drifting orbital glow inside the circular matrix.",
    componentName: "CircularPhaseOrbitMatrix",
    fileName: "circular-phase-orbit-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-gate-flip-matrix",
    title: "Circular Gate Flip",
    description:
      "A scanning gate flips between vertical and horizontal sweeps, producing a crisp alternating shutter rhythm in the circular grid.",
    componentName: "CircularGateFlipMatrix",
    fileName: "circular-gate-flip-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-heartbeat-matrix",
    title: "Circular Heartbeat",
    description:
      "Pulse bursts from the center with a dual-beat cadence, sending soft concentric pressure waves across the circular matrix.",
    componentName: "CircularHeartbeatMatrix",
    fileName: "circular-heartbeat-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-constellation-matrix",
    title: "Circular Constellation",
    description:
      "A cardinal beacon pattern: N/E/S/W sectors pulse in sequence with a dim opposite echo, creating a clear directional rhythm in the circular mask.",
    componentName: "CircularConstellationMatrix",
    fileName: "circular-constellation-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-binary-bloom-matrix",
    title: "Circular Binary Bloom",
    description:
      "Binary-style opacity tiers pulse in modular steps so only a few cells peak at once while others stay low, producing a crisp coded bloom.",
    componentName: "CircularBinaryBloomMatrix",
    fileName: "circular-binary-bloom-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-quadrant-breathe-matrix",
    title: "Circular Quadrant Breathe",
    description:
      "A rotating crescent moon silhouette: bright lunar body, soft rim, and faint directional halo moving around the circular mask.",
    componentName: "CircularQuadrantBreatheMatrix",
    fileName: "circular-quadrant-breathe-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-arc-cascade-matrix",
    title: "Circular Arc Cascade",
    description:
      "A stepped 8-direction beacon beam sweeps around the circle with a dim opposite echo and diagonal spoke accents.",
    componentName: "CircularArcCascadeMatrix",
    fileName: "circular-arc-cascade-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-dna-twin-helix-matrix",
    title: "Circular DNA Twin Helix",
    description:
      "A circular-masked twin-helix: mirrored side strands weave inward and outward with intermittent interior bridge pulses.",
    componentName: "CircularDnaTwinHelixMatrix",
    fileName: "circular-dna-twin-helix-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-dna-rung-shift-matrix",
    title: "Circular DNA Rung Shift",
    description:
      "A shifting DNA ladder where a bright horizontal rung steps row-by-row while side anchors sway and leave soft ghost echoes.",
    componentName: "CircularDnaRungShiftMatrix",
    fileName: "circular-dna-rung-shift-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-cluster-matrix",
    title: "Circular Braille Cluster",
    description:
      "Braille-inspired grouped dot motifs cycle through rails, bridges, and cross forms inside the circular mask with crisp tiered opacity.",
    componentName: "CircularBrailleClusterMatrix",
    fileName: "circular-braille-cluster-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-scanline-matrix",
    title: "Circular Braille Scanline",
    description:
      "A braille rail scanline sweeps row-by-row between left and right cells, with near-column accents and soft trail falloff.",
    componentName: "CircularBrailleScanlineMatrix",
    fileName: "circular-braille-scanline-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-checker-shift-matrix",
    title: "Circular Braille Checker Shift",
    description:
      "Braille-biased checker phases alternate in stepped shifts, keeping rails pronounced while the center cross supports readability.",
    componentName: "CircularBrailleCheckerShiftMatrix",
    fileName: "circular-braille-checker-shift-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-pulse-pair-matrix",
    title: "Circular Braille Pulse Pair",
    description:
      "Mirrored braille dot pairs pulse from top and bottom toward the center, with a connective center-column accent.",
    componentName: "CircularBraillePulsePairMatrix",
    fileName: "circular-braille-pulse-pair-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-orbit-cells-matrix",
    title: "Circular Braille Orbit Cells",
    description:
      "A bright braille cell head orbits the inner ring with a dim tail while rail columns remain softly active.",
    componentName: "CircularBrailleOrbitCellsMatrix",
    fileName: "circular-braille-orbit-cells-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "circular-braille-glyph-cycle-matrix",
    title: "Circular Braille Glyph Cycle",
    description:
      "Distinct braille-like glyphs cycle in sequence with previous-frame ghosting for a crisp readable symbol transition.",
    componentName: "CircularBrailleGlyphCycleMatrix",
    fileName: "circular-braille-glyph-cycle-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-center-spokes-matrix",
    title: "Triangle Center Spokes",
    description:
      "A triangle-masked matrix where three spoke lines originate at the center and travel outward to each triangle edge.",
    componentName: "TriangleCenterSpokesMatrix",
    fileName: "triangle-center-spokes-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-altitude-pulse-matrix",
    title: "Triangle Altitude Pulse",
    description:
      "A soft altitude wave travels between apex and base while the center column remains gently present for shape readability.",
    componentName: "TriangleAltitudePulseMatrix",
    fileName: "triangle-altitude-pulse-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-corner-bounce-matrix",
    title: "Triangle Corner Bounce",
    description:
      "A single head bounces between triangle corners along the perimeter path with a short fading tail.",
    componentName: "TriangleCornerBounceMatrix",
    fileName: "triangle-corner-bounce-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-vertex-chase-matrix",
    title: "Triangle Vertex Chase",
    description:
      "Three staggered heads chase around the triangle perimeter, leaving short fading tails while all dots stay fixed in place.",
    componentName: "TriangleVertexChaseMatrix",
    fileName: "triangle-vertex-chase-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-row-scan-matrix",
    title: "Triangle Row Scan",
    description:
      "A reflected scanline sweeps from apex to base and back, animating only opacity bands across triangle rows.",
    componentName: "TriangleRowScanMatrix",
    fileName: "triangle-row-scan-matrix.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "triangle-braille-beat-matrix",
    title: "Triangle Braille Beat",
    description:
      "Triangle-masked braille dots fill down the left rail, then the right, then blink full and empty.",
    componentName: "TriangleBrailleBeatMatrix",
    fileName: "triangle-braille-beat-matrix.tsx",
    dependencies: [],
    motionOptional: false
  }
];

export function getLoaderBySlug(slug: string): LoaderRegistryEntry | undefined {
  return loaderRegistry.find((entry) => entry.slug === slug);
}
