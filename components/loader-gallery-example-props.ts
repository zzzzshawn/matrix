import type { ExamplePreviewId } from "@/components/loader-details-drawer";
import type { DotMatrixCommonProps } from "@/loaders";

/** Default gallery preview; must stay aligned with "Example usage" snippets in the drawer (incl. bloom). */
export const LOADER_GALLERY_EXAMPLE_SNIPPET_PROPS: Record<ExamplePreviewId, Partial<DotMatrixCommonProps>> = {
  "ex-bloom": {
    bloom: true,
    size: 32,
    dotSize: 4,
    speed: 1.2
  },
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

/** Triangle 7x7 has no dmx opacity tokens; only size/dot/speed in props. */
export const LOADER_GALLERY_EX_OPACITY_FOR_TRIANGLE: Partial<DotMatrixCommonProps> = {
  size: 32,
  dotSize: 4,
  speed: 1.4
};
