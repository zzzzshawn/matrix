import type { ReactNode } from "react";

type LoaderKind = "square" | "circular" | "triangle" | "hex";

const PATTERN_TYPE = `"diamond" | "full" | "outline" | "rose" | "cross" | "rings"`;

const PATTERN_LIST = ["diamond", "full", "outline", "rose", "cross", "rings"] as const;

type DefaultFn = (kind: LoaderKind) => string | undefined;

type PropRow = {
  name: string;
  type: string;
  description: string;
  default?: string | DefaultFn;
  kinds: readonly LoaderKind[];
};

function d(get: (kind: LoaderKind) => string | undefined): string | DefaultFn {
  return (kind) => get(kind);
}

const PROP_ROWS: readonly PropRow[] = [
  {
    name: "size",
    type: "number",
    description:
      "Overall scale of the matrix. With the default 5×5 layout, the outer box is derived from the grid track span (and ignored when you use a fixed `cellPadding` / box layout on square & circular).",
    default: d((k) => (k === "triangle" ? "30" : k === "hex" ? "42" : "24")),
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "dotSize",
    type: "number",
    description: "Width and height of each dot in pixels.",
    default: d((k) => (k === "triangle" ? "4" : k === "hex" ? "5" : "3")),
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "color",
    type: "string",
    description: "Fill color for dots, passed through as the matrix `color` (typically `currentColor` or a CSS color string).",
    default: "currentColor",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "speed",
    type: "number",
    description: "Animation speed multiplier. Higher values run the cycle faster; values ≤ 0 are treated as 1 for timing.",
    default: "1",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "ariaLabel",
    type: "string",
    description: "Accessible name for the loading indicator (`aria-label` on the status element).",
    default: "Loading",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "className",
    type: "string",
    description: "Optional class on the root / wrapper (and on the matrix root when not using the slot wrapper).",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "muted",
    type: "boolean",
    description: "Enables the muted dmx look (softer visual treatment on the root).",
    default: "false",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "bloom",
    type: "boolean",
    description:
      "Adds a glow treatment: after remapping, dots from opacity 0.6 (weakest glow) up to 1 (strongest) get a graded bloom.",
    default: "false",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "halo",
    type: "number (0…1)",
    description:
      "Uniform glow on every active dot: 0 is off, 1 is strongest. Same `--dmx-bloom-level` as `bloom`, with a slightly wider drop-shadow falloff than selective bloom only.",
    default: "0",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "animated",
    type: "boolean",
    description:
      "When true, enables the loader's motion. Continuous auto-loop runs only if `hoverAnimated` is false; if both are true, motion is hover-only (reduced motion still respected).",
    default: "true",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "hoverAnimated",
    type: "boolean",
    description:
      "When true, disables automatic looping — animation runs on pointer hover instead. With `animated={false}`, the loader stays static until hover (reduced motion still respected).",
    default: "false",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "dotClassName",
    type: "string",
    description: "Extra `className` applied to every dot `span` for one-off styling.",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "pattern",
    type: PATTERN_TYPE,
    description: `Active cells on the 5×5 matrix projection. One of: ${PATTERN_LIST.join(", ")}.`,
    default: '"full"',
    kinds: ["square", "hex"]
  },
  {
    name: "opacityBase",
    type: "number (0…1)",
    description: "Controls the dimmest baseline opacity (0–1) used by the loader's opacity curve.",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "opacityMid",
    type: "number (0…1)",
    description: "Controls the middle brightness stop (0–1) in the loader's opacity curve.",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "opacityPeak",
    type: "number (0…1)",
    description: "Controls the brightest stop (0–1) in the loader's opacity curve.",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "cellPadding",
    type: "number",
    description:
      "Fixed gap in pixels between grid tracks. When set, layout uses `dotSize * N + cellPadding * (N - 1)` (N is the matrix dimension) and ignores `size` for track spacing.",
    kinds: ["square", "circular", "triangle", "hex"]
  },
  {
    name: "boxSize",
    type: "number",
    description:
      "Target outer width/height in px; the matrix is scaled uniformly to fit (combined with `minSize`). Not used by triangle.",
    kinds: ["square", "circular", "hex"]
  },
  {
    name: "minSize",
    type: "number",
    description: "Minimum width and height in px of the root slot before any `boxSize` scaling. Not used by triangle.",
    kinds: ["square", "circular", "hex"]
  }
] as const;

function resolveDefault(row: PropRow, kind: LoaderKind): string | undefined {
  if (row.default == null) {
    return;
  }
  if (typeof row.default === "function") {
    return row.default(kind);
  }
  return row.default;
}

function loaderKindFromSlug(slug: string): LoaderKind {
  if (slug.startsWith("dotm-triangle-")) {
    return "triangle";
  }
  if (slug.startsWith("dotm-circular-")) {
    return "circular";
  }
  if (slug.startsWith("dotm-hex-")) {
    return "hex";
  }
  return "square";
}

const pill = [
  "inline max-w-full rounded-md bg-surface-soft px-2 py-0.5",
  "font-mono text-[11px] leading-snug theme-text [overflow-wrap:anywhere]"
].join(" ");

const label = "theme-text-muted w-[2.5rem] shrink-0 select-none text-[12px] font-medium";

function inlineCodeDesc(text: string): ReactNode {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="theme-text font-mono">
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const exampleUsageDotRail = (
  <div className="flex items-center gap-1 overflow-hidden">
    {Array.from({ length: 150 }).map((_, i) => (
      <div key={i} className="size-0.5 shrink-0 rounded-full bg-(--color-dot-faint)" />
    ))}
  </div>
);

function extractExplicitPropNames(sourceCode?: string): { names: Set<string>; hasRestSpread: boolean } | null {
  if (!sourceCode) {
    return null;
  }

  const fnMatch = sourceCode.match(/export\s+function\s+\w+\s*\(\s*\{([\s\S]*?)\}\s*:\s*[\w<>{}\[\]\s|&?,.]+?\)/);
  if (!fnMatch) {
    return null;
  }

  const rawParams = fnMatch[1];
  if (!rawParams) {
    return null;
  }

  const names = new Set<string>();
  let hasRestSpread = false;

  for (const piece of rawParams.split(",")) {
    const trimmed = piece.trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed.startsWith("...")) {
      hasRestSpread = true;
      continue;
    }
    const nameMatch = trimmed.match(/^([A-Za-z_]\w*)\s*(?:=|$)/);
    if (nameMatch?.[1]) {
      names.add(nameMatch[1]);
    }
  }

  return { names, hasRestSpread };
}

export function LoaderPropsReference({ slug, sourceCode }: { slug: string; sourceCode?: string }) {
  const kind = loaderKindFromSlug(slug);
  const baseRows = PROP_ROWS.filter((r) => r.kinds.includes(kind));
  const extracted = extractExplicitPropNames(sourceCode);
  const rows =
    extracted && !extracted.hasRestSpread
      ? baseRows.filter((row) => extracted.names.has(row.name))
      : baseRows;

  return (
    <>
      {exampleUsageDotRail}
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <p className="theme-text-strong text-base font-semibold tracking-tight">Component props</p>
        </div>
        <div className="grid gap-8">
          {rows.map((row) => {
            const def = resolveDefault(row, kind);
            return (
              <div key={row.name} className="grid gap-2.5">
                <div className="flex w-max items-center rounded-lg bg-surface-soft px-3 py-2">
                  <span className="theme-text-strong font-mono text-[12px]">{row.name}</span>
                </div>
                <p className="theme-text max-w-2xl text-pretty text-[14px]">{inlineCodeDesc(row.description)}</p>
                <div className="grid gap-2 pl-0.5">
                  <div className="flex  gap-1.5 min-[400px]:flex-row min-[400px]:items-start min-[400px]:gap-3">
                    <span className={label}>type:</span>
                    <span className={pill}>{row.type}</span>
                  </div>
                  {def != null && def !== "" ? (
                    <div className="flex  gap-1.5 min-[400px]:flex-row min-[400px]:items-start min-[400px]:gap-3">
                      <span className={label}>default:</span>
                      <span className={pill}>{def}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
