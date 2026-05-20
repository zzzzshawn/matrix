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
    slug: "dotm-square-1",
    title: "Neon Drift",
    description: "Same ripple family as the icon, with a wave that sweeps from the top-right toward the bottom-left.",
    componentName: "DotmSquare1",
    fileName: "dotm-square-1.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-2",
    title: "Pulse Ladder",
    description:
      "Clockwise snake route: starts bottom-left up column 1, jumps to column 3 down, then column 2 up, and continues the same cycle to the right.",
    componentName: "DotmSquare2",
    fileName: "dotm-square-2.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-3",
    title: "Core Spiral",
    description: "A 4-dot tail spirals clockwise from the outer border toward the center of the 5x5 grid.",
    componentName: "DotmSquare3",
    fileName: "dotm-square-3.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-4",
    title: "Twin Orbit",
    description:
      "Outer ring snake moves clockwise, middle ring snake moves anticlockwise, and the center dot stays inactive.",
    componentName: "DotmSquare4",
    fileName: "dotm-square-4.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-5",
    title: "Prism Sweep",
    description: "Snake-style trail that traverses the 5x5 grid on alternating diagonals.",
    componentName: "DotmSquare5",
    fileName: "dotm-square-5.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-6",
    title: "Flux Columns",
    description: "Five simultaneous snakes: columns 1/3/5 move up while columns 2/4 move down.",
    componentName: "DotmSquare6",
    fileName: "dotm-square-6.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-7",
    title: "Block Drop",
    description: "Tetromino-like frames drop and stack in a 5x5 matrix, then flash a row-clear beat.",
    componentName: "DotmSquare7",
    fileName: "dotm-square-7.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-8",
    title: "Strobe Stack",
    description:
      "Each column stacks upward on a stagger (Tetris-style), the full grid blinks twice, then columns drain downward with the same stagger.",
    componentName: "DotmSquare8",
    fileName: "dotm-square-8.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-9",
    title: "Glyph Pulse",
    description:
      "Two synced 2×3 cells (Unicode dot order) step through clear motifs: rails, full grid, three rows, checker, horseshoes, and alternating columns.",
    componentName: "DotmSquare9",
    fileName: "dotm-square-9.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-10",
    title: "CRT Glide",
    description:
      "A CRT-style horizontal scanline moves down the matrix; swept rows leave a soft phosphor trail with a slight column-wise warp.",
    componentName: "DotmSquare10",
    fileName: "dotm-square-10.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-11",
    title: "Echo Ring",
    description: "Concentric diamond ripple with a soft secondary echo pulse per ring.",
    componentName: "DotmSquare11",
    fileName: "dotm-square-11.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-12",
    title: "Origin Wave",
    description: "Ripple starts at cell (2,2) and expands outward in concentric rings.",
    componentName: "DotmSquare12",
    fileName: "dotm-square-12.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-13",
    title: "Core Rotor",
    description: "Single fan blade rotating around a center hub for a clean, readable loop.",
    componentName: "DotmSquare13",
    fileName: "dotm-square-13.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-14",
    title: "Prism Bloom",
    description: "A symmetric kaleidoscope bloom cycling through clean radial motifs.",
    componentName: "DotmSquare14",
    fileName: "dotm-square-14.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-15",
    title: "Helix Glow",
    description: "Two mirrored strands with periodic bridges pulse like a compact DNA helix.",
    componentName: "DotmSquare15",
    fileName: "dotm-square-15.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-16",
    title: "Helix Core",
    description: "A narrower helix variant that stays in the center band while preserving strand/rung rhythm.",
    componentName: "DotmSquare16",
    fileName: "dotm-square-16.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-17",
    title: "Half Helix",
    description: "Single-strand helix variant that shows one side of the DNA wave.",
    componentName: "DotmSquare17",
    fileName: "dotm-square-17.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-18",
    title: "Sound Bars",
    description: "Equalizer-style vertical bars that pulse like live music levels.",
    componentName: "DotmSquare18",
    fileName: "dotm-square-18.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-19",
    title: "Infinity Run",
    description: "Dual counter-rotating heads trace a figure-eight with a soft crossover pulse at center.",
    componentName: "DotmSquare19",
    fileName: "dotm-square-19.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-square-20",
    title: "Mobius Run",
    description:
      "A bright head and tail run around the outer ring; a dimmer second train stays half a lap behind, with inner corner flashes for the twist.",
    componentName: "DotmSquare20",
    fileName: "dotm-square-20.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-1",
    title: "Halo Drift",
    description:
      "A circular-masked half-helix that travels diagonally from top-left to bottom-right with a bright strand and soft adjacent trail.",
    componentName: "DotmCircular1",
    fileName: "dotm-circular-1.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-2",
    title: "Tri Orbit",
    description:
      "Three luminous heads orbit the circular ring at equal offsets, creating a triad chase that never overlaps into the old snake rhythm.",
    componentName: "DotmCircular2",
    fileName: "dotm-circular-2.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-3",
    title: "Plasma Veil",
    description:
      "A plasma-like diagonal sweep and pulsing core weave through the circular mask for a distinctly different motion signature.",
    componentName: "DotmCircular3",
    fileName: "dotm-circular-3.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-4",
    title: "Radar Arc",
    description:
      "A rotating radar arm scans the circular grid with a bright beam front, soft wake, and faint perimeter ring echo.",
    componentName: "DotmCircular4",
    fileName: "dotm-circular-4.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-5",
    title: "Nova Wheel",
    description:
      "Four rotating pinwheel blades spin through the circular matrix with a glowing center and soft trailing halo.",
    componentName: "DotmCircular5",
    fileName: "dotm-circular-5.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-6",
    title: "Phase Orb",
    description:
      "An off-center orbiting energy point traces a phase-shifted loop, creating a drifting orbital glow inside the circular matrix.",
    componentName: "DotmCircular6",
    fileName: "dotm-circular-6.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-7",
    title: "Gate Shift",
    description:
      "A scanning gate flips between vertical and horizontal sweeps, producing a crisp alternating shutter rhythm in the circular grid.",
    componentName: "DotmCircular7",
    fileName: "dotm-circular-7.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-8",
    title: "Heart Pulse",
    description:
      "Pulse bursts from the center with a dual-beat cadence, sending soft concentric pressure waves across the circular matrix.",
    componentName: "DotmCircular8",
    fileName: "dotm-circular-8.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-9",
    title: "Star Compass",
    description:
      "A cardinal beacon pattern: N/E/S/W sectors pulse in sequence with a dim opposite echo, creating a clear directional rhythm in the circular mask.",
    componentName: "DotmCircular9",
    fileName: "dotm-circular-9.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-10",
    title: "Binary Bloom",
    description:
      "Binary-style opacity tiers pulse in modular steps so only a few cells peak at once while others stay low, producing a crisp coded bloom.",
    componentName: "DotmCircular10",
    fileName: "dotm-circular-10.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-11",
    title: "Lunar Breathe",
    description:
      "A rotating crescent moon silhouette: bright lunar body, soft rim, and faint directional halo moving around the circular mask.",
    componentName: "DotmCircular11",
    fileName: "dotm-circular-11.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-12",
    title: "Arc Beacon",
    description:
      "A stepped 8-direction beacon beam sweeps around the circle with a dim opposite echo and diagonal spoke accents.",
    componentName: "DotmCircular12",
    fileName: "dotm-circular-12.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-13",
    title: "Twin Helix",
    description:
      "A circular-masked twin-helix: mirrored side strands weave inward and outward with intermittent interior bridge pulses.",
    componentName: "DotmCircular13",
    fileName: "dotm-circular-13.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-14",
    title: "Rung Shift",
    description:
      "A shifting DNA ladder where a bright horizontal rung steps row-by-row while side anchors sway and leave soft ghost echoes.",
    componentName: "DotmCircular14",
    fileName: "dotm-circular-14.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-15",
    title: "Glyph Cluster",
    description:
      "Braille-inspired grouped dot motifs cycle through rails, bridges, and cross forms inside the circular mask with crisp tiered opacity.",
    componentName: "DotmCircular15",
    fileName: "dotm-circular-15.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-16",
    title: "Rail Scan",
    description:
      "A braille rail scanline sweeps row-by-row between left and right cells, with near-column accents and soft trail falloff.",
    componentName: "DotmCircular16",
    fileName: "dotm-circular-16.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-17",
    title: "Checker Shift",
    description:
      "Braille-biased checker phases alternate in stepped shifts, keeping rails pronounced while the center cross supports readability.",
    componentName: "DotmCircular17",
    fileName: "dotm-circular-17.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-18",
    title: "Pulse Pair",
    description:
      "Mirrored braille dot pairs pulse from top and bottom toward the center, with a connective center-column accent.",
    componentName: "DotmCircular18",
    fileName: "dotm-circular-18.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-19",
    title: "Orbit Cell",
    description:
      "A bright braille cell head orbits the inner ring with a dim tail while rail columns remain softly active.",
    componentName: "DotmCircular19",
    fileName: "dotm-circular-19.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-circular-20",
    title: "Glyph Cycle",
    description:
      "Distinct braille-like glyphs cycle in sequence with previous-frame ghosting for a crisp readable symbol transition.",
    componentName: "DotmCircular20",
    fileName: "dotm-circular-20.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-1",
    title: "Core Spokes",
    description:
      "A triangle-masked matrix where three spoke lines originate at the center and travel outward to each triangle edge.",
    componentName: "DotmTriangle1",
    fileName: "dotm-triangle-1.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-2",
    title: "Altitude Wave",
    description:
      "A soft altitude wave travels between apex and base while the center column remains gently present for shape readability.",
    componentName: "DotmTriangle2",
    fileName: "dotm-triangle-2.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-3",
    title: "Corner Bounce",
    description:
      "A single head bounces between triangle corners along the perimeter path with a short fading tail.",
    componentName: "DotmTriangle3",
    fileName: "dotm-triangle-3.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-4",
    title: "Vertex Chase",
    description:
      "Three staggered heads chase around the triangle perimeter, leaving short fading tails while all dots stay fixed in place.",
    componentName: "DotmTriangle4",
    fileName: "dotm-triangle-4.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-5",
    title: "Row Sweep",
    description:
      "A reflected scanline sweeps from apex to base and back, animating only opacity bands across triangle rows.",
    componentName: "DotmTriangle5",
    fileName: "dotm-triangle-5.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-6",
    title: "Braille Beat",
    description:
      "Triangle-masked braille dots fill down the left rail, then the right, then blink full and empty.",
    componentName: "DotmTriangle6",
    fileName: "dotm-triangle-6.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-7",
    title: "Oblique Weave",
    description:
      "Diagonal harmonics keyed on row + col: bright bands glide along oblique lines through the triangle with a subtle second harmonic for texture.",
    componentName: "DotmTriangle7",
    fileName: "dotm-triangle-7.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-8",
    title: "Wing Metronome",
    description:
      "The lower triangle splits into left and right wings that trade emphasis on a pendulum beat; apex and center pulse brightest when both sides meet in the middle.",
    componentName: "DotmTriangle8",
    fileName: "dotm-triangle-8.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-9",
    title: "Corona Tier",
    description:
      "Eight-connected distance rings from the heart cell: a bright corona sweeps outward through discrete tiers then back, so depth reads as concentric energy shells.",
    componentName: "DotmTriangle9",
    fileName: "dotm-triangle-9.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-10",
    title: "Column Rake",
    description:
      "A stepped head and tail snake the mask in strict column order (bottom to top per column, columns left to right), unlike perimeter chases or diagonal waves.",
    componentName: "DotmTriangle10",
    fileName: "dotm-triangle-10.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-11",
    title: "Shelf Descent",
    description:
      "Cosine bands keyed on Manhattan distance from the apex (not the center): energy reads as horizontal tiers dropping through the triangle.",
    componentName: "DotmTriangle11",
    fileName: "dotm-triangle-11.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-12",
    title: "Skew Drift",
    description:
      "Traveling harmonics on `row - col` so bright ridges move along NE–SW obliques, orthogonal in feel to diagonal loaders that use `row + col`.",
    componentName: "DotmTriangle12",
    fileName: "dotm-triangle-12.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-13",
    title: "Serpent Zip",
    description:
      "A stepped snake follows row-wise serpentine order (base left→right, then alternating row directions) with a long tail — zigzag motion, not a column path.",
    componentName: "DotmTriangle13",
    fileName: "dotm-triangle-13.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-14",
    title: "Pillar Sweep",
    description:
      "A smooth vertical beam sweeps grid columns 0→6; only triangle-masked dots respond so the silhouette lights one vertical slice at a time.",
    componentName: "DotmTriangle14",
    fileName: "dotm-triangle-14.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-15",
    title: "Tripod Handoff",
    description:
      "Brightness hands off smoothly among the three silhouette vertices (apex, left base, right base) with Manhattan falloff — a corner-to-corner orbit, not a mod-3 lattice.",
    componentName: "DotmTriangle15",
    fileName: "dotm-triangle-15.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-16",
    title: "Updraft",
    description:
      "A V-shaped thermal ridge moves through row-and-column space: brightness peaks along an inverted V so the front climbs the two lower flanks toward the apex, not a flat horizontal row scan like Row Sweep.",
    componentName: "DotmTriangle16",
    fileName: "dotm-triangle-16.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-17",
    title: "Infinity Trace",
    description:
      "A stepped head and tail follow a single 10-cell path: left base up to the apex, down the right rim, then through (4,4) → center → (4,2) for a crossing loop.",
    componentName: "DotmTriangle17",
    fileName: "dotm-triangle-17.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-18",
    title: "Hollow Shell",
    description:
      "The heart cell stays locked dim while every other triangle dot breathes together in phase — a hollow, ring-like pulse.",
    componentName: "DotmTriangle18",
    fileName: "dotm-triangle-18.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-19",
    title: "Pivot Ray",
    description:
      "A Gaussian wedge of brightness rotates around the heart cell using each dot’s polar angle — a clear pivoting searchlight, not a cosine-product moiré field.",
    componentName: "DotmTriangle19",
    fileName: "dotm-triangle-19.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-triangle-20",
    title: "Twin Perimeter",
    description:
      "Two stepped heads chase the outer perimeter path half a lap apart, each with its own tail; the heart cell stays quietly dim off the loop.",
    componentName: "DotmTriangle20",
    fileName: "dotm-triangle-20.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-1",
    title: "Hex Orbit",
    description:
      "A 3-4-5-4-3 hexagonal dot field with two soft perimeter heads chasing around the shell while the center stays quietly lit.",
    componentName: "DotmHex1",
    fileName: "dotm-hex-1.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-2",
    title: "Prism Bloom",
    description:
      "Three rotating spokes sweep through the hex field with a soft outer shell pulse and a breathing center point.",
    componentName: "DotmHex2",
    fileName: "dotm-hex-2.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-3",
    title: "Honey Gate",
    description:
      "Two diagonal bands slide through the honeycomb from opposite sides, meeting in a bright center flash before opening again.",
    componentName: "DotmHex3",
    fileName: "dotm-hex-3.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-4",
    title: "Vertex Relay",
    description:
      "A bright signal hands off around the hex vertices while inner echo dots answer each corner and the center keeps a quick pulse.",
    componentName: "DotmHex4",
    fileName: "dotm-hex-4.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-5",
    title: "Spiral Lattice",
    description:
      "Counter-rotating spiral waves cross through the hex lattice, creating a fast core pulse and softer outer wake.",
    componentName: "DotmHex5",
    fileName: "dotm-hex-5.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-6",
    title: "Chevron March",
    description:
      "Smooth chevron bands flow through the hex field in a wrapped loop, keeping an obvious arrow pattern without a reset snap.",
    componentName: "DotmHex6",
    fileName: "dotm-hex-6.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-7",
    title: "Hourglass Flip",
    description:
      "Top and bottom bars squeeze into a bright center hourglass, then flip into side rails and a diamond.",
    componentName: "DotmHex7",
    fileName: "dotm-hex-7.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-8",
    title: "Glyph Flip",
    description:
      "Crisp symbolic masks flip between stars, chevrons, and rails for a snappy pixel-glyph loader.",
    componentName: "DotmHex8",
    fileName: "dotm-hex-8.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-9",
    title: "Petal Shimmer",
    description:
      "A four-petal highlight rotates through the hex with a soft shell sheen and steady center glow.",
    componentName: "DotmHex9",
    fileName: "dotm-hex-9.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-hex-10",
    title: "Liquid Vortex",
    description:
      "Refined swirl bands and a slower lens highlight create a smoother liquid shimmer through the hex lattice.",
    componentName: "DotmHex10",
    fileName: "dotm-hex-10.tsx",
    dependencies: [],
    motionOptional: false
  },
  {
    slug: "dotm-pong",
    title: "Pong Loader",
    description: "A classic Pong game animation loader.",
    componentName: "DotmPong",
    fileName: "dotm-pong.tsx",
    dependencies: [],
    motionOptional: false
  }
];

export function getLoaderBySlug(slug: string): LoaderRegistryEntry | undefined {
  return loaderRegistry.find((entry) => entry.slug === slug);
}
