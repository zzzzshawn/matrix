"use client";

import { ShikiCodeView } from "@/components/shiki-code-view";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import type { BundledLanguage } from "shiki/bundle/web";

export type ShadcnPackageManager = "npm" | "yarn" | "bun" | "pnpm";

export const SHADCN_PACKAGE_MANAGERS: ShadcnPackageManager[] = ["npm", "yarn", "bun", "pnpm"];

/** Match CLI / Manual dot rail in `loader-details-drawer.tsx`. */
const PM_TAB_DOT_ROW_H = 6;
const PM_TAB_DOT_GAP_PX = 9;

export function shadcnRegistryAddCommand(pm: ShadcnPackageManager, scopedItemName: string) {
  switch (pm) {
    case "npm":
      return `npx shadcn@latest add ${scopedItemName}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${scopedItemName}`;
    case "bun":
      return `bunx shadcn@latest add ${scopedItemName}`;
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${scopedItemName}`;
    default:
      return `npx shadcn@latest add ${scopedItemName}`;
  }
}

const ICON_DOT_GRID: Array<[number, number]> = [];
for (let y = 2; y <= 22; y += 2) {
  for (let x = 2; x <= 22; x += 2) {
    ICON_DOT_GRID.push([x, y]);
  }
}

function dotKey(x: number, y: number) {
  return `${x},${y}`;
}

/** Euclidean ring from grid center (cell 5,5) — matches `DotMatrixIcon` ripple staggering. */
function heartRippleRing(x: number, y: number): number {
  const col = (x - 2) / 2;
  const row = (y - 2) / 2;
  return Math.round(Math.hypot(row - 5, col - 5));
}

const HEART_MATRIX_ACTIVE: ReadonlyArray<readonly [number, number]> = [
  [8, 4],
  [10, 4],
  [14, 4],
  [16, 4],
  [6, 6],
  [8, 6],
  [10, 6],
  [12, 6],
  [14, 6],
  [16, 6],
  [18, 6],
  [4, 8],
  [6, 8],
  [8, 8],
  [10, 8],
  [12, 8],
  [14, 8],
  [16, 8],
  [18, 8],
  [20, 8],
  [4, 10],
  [6, 10],
  [8, 10],
  [10, 10],
  [12, 10],
  [14, 10],
  [16, 10],
  [18, 10],
  [20, 10],
  [6, 12],
  [8, 12],
  [10, 12],
  [12, 12],
  [14, 12],
  [16, 12],
  [18, 12],
  [8, 14],
  [10, 14],
  [12, 14],
  [14, 14],
  [16, 14],
  [10, 16],
  [12, 16],
  [14, 16],
  [12, 18]
];

export type MatrixDotIconProps = {
  className?: string;
  /** SVG width/height in CSS pixels. Default 18. */
  size?: number;
};

export function CopyClipboardIcon({ className, size = 18 }: MatrixDotIconProps) {
  const activeDots = new Set<string>([
    // top tab (M10 2H14) + cap (M8 4V6H16V4)
    dotKey(10, 2), dotKey(12, 2), dotKey(14, 2),
    dotKey(8, 4), dotKey(10, 4), dotKey(12, 4), dotKey(14, 4), dotKey(16, 4),
    dotKey(8, 6), dotKey(10, 6), dotKey(12, 6), dotKey(14, 6), dotKey(16, 6),
    // side rails (M4 5V20 and M20 5V20)
    dotKey(4, 6), dotKey(4, 8), dotKey(4, 10), dotKey(4, 12), dotKey(4, 14), dotKey(4, 16), dotKey(4, 18), dotKey(4, 20),
    dotKey(20, 6), dotKey(20, 8), dotKey(20, 10), dotKey(20, 12), dotKey(20, 14), dotKey(20, 16), dotKey(20, 18), dotKey(20, 20),
    // bottom rail (M18 22L6 22)
    dotKey(6, 22), dotKey(8, 22), dotKey(10, 22), dotKey(12, 22), dotKey(14, 22), dotKey(16, 22), dotKey(18, 22)
  ]);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {ICON_DOT_GRID.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.7"
          fill="currentColor"
          opacity={0.1}
        />
      ))}
      {ICON_DOT_GRID.filter(([x, y]) => activeDots.has(dotKey(x, y))).map(([x, y]) => (
        <circle
          key={`active-${x}-${y}`}
          cx={x}
          cy={y}
          r="0.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function CheckIcon({ className, size = 18 }: MatrixDotIconProps) {
  const activeDots = new Set<string>([
    // Clipboard shell
    dotKey(10, 2), dotKey(12, 2), dotKey(14, 2),
    dotKey(8, 4), dotKey(10, 4), dotKey(12, 4), dotKey(14, 4), dotKey(16, 4),
    dotKey(8, 6), dotKey(10, 6), dotKey(12, 6), dotKey(14, 6), dotKey(16, 6),
    dotKey(4, 6), dotKey(4, 8), dotKey(4, 10), dotKey(4, 12), dotKey(4, 14), dotKey(4, 16), dotKey(4, 18), dotKey(4, 20),
    dotKey(20, 6), dotKey(20, 8), dotKey(20, 10), dotKey(20, 12), dotKey(20, 14), dotKey(20, 16), dotKey(20, 18), dotKey(20, 20),
    dotKey(6, 22), dotKey(8, 22), dotKey(10, 22), dotKey(12, 22), dotKey(14, 22), dotKey(16, 22), dotKey(18, 22),
    // Inner success pattern (dot-matrix version of provided points)
    dotKey(10, 18), dotKey(12, 16), dotKey(14, 14), dotKey(16, 12), dotKey(8, 16)
  ]);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {ICON_DOT_GRID.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.7"
          fill="currentColor"
          opacity={0.1}
        />
      ))}
      {ICON_DOT_GRID.filter(([x, y]) => activeDots.has(dotKey(x, y))).map(([x, y]) => (
        <circle
          key={`active-${x}-${y}`}
          cx={x}
          cy={y}
          r="0.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function ThemeMatrixIcon({ className, size = 18 }: MatrixDotIconProps) {
  const activeDots = new Set<string>([
    dotKey(2, 8), dotKey(2, 10), dotKey(2, 12), dotKey(2, 14), dotKey(2, 16),
    dotKey(4, 6), dotKey(4, 8), dotKey(4, 10), dotKey(4, 12), dotKey(4, 14), dotKey(4, 16), dotKey(4, 18),
    dotKey(6, 4), dotKey(6, 6), dotKey(6, 8), dotKey(6, 14), dotKey(6, 16), dotKey(6, 18), dotKey(6, 20),
    dotKey(8, 2), dotKey(8, 4), dotKey(8, 6), dotKey(8, 16), dotKey(8, 18), dotKey(8, 20), dotKey(8, 22),
    dotKey(10, 2), dotKey(10, 4), dotKey(10, 18), dotKey(10, 20), dotKey(10, 22),
    dotKey(12, 2), dotKey(12, 6), dotKey(12, 8), dotKey(12, 10), dotKey(12, 12), dotKey(12, 14), dotKey(12, 16), dotKey(12, 18), dotKey(12, 22),
    dotKey(14, 2), dotKey(14, 6), dotKey(14, 8), dotKey(14, 10), dotKey(14, 12), dotKey(14, 14), dotKey(14, 16), dotKey(14, 18), dotKey(14, 22),
    dotKey(16, 2), dotKey(16, 8), dotKey(16, 10), dotKey(16, 12), dotKey(16, 14), dotKey(16, 16), dotKey(16, 22),
    dotKey(18, 4), dotKey(18, 10), dotKey(18, 12), dotKey(18, 14), dotKey(18, 20),
    dotKey(20, 6), dotKey(20, 18),
    dotKey(22, 8), dotKey(22, 10), dotKey(22, 12), dotKey(22, 14), dotKey(22, 16)
  ]);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {ICON_DOT_GRID.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.7"
          fill="currentColor"
          opacity={0.1}
        />
      ))}
      {ICON_DOT_GRID.filter(([x, y]) => activeDots.has(dotKey(x, y))).map(([x, y]) => (
        <circle
          key={`active-${x}-${y}`}
          cx={x}
          cy={y}
          r="0.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

/** Dot-matrix home silhouette; same 24×24 grid and dot style as `ThemeMatrixIcon`. */
export function HomeMatrixIcon({ className, size = 18 }: MatrixDotIconProps) {
  const activeDots = new Set<string>([
    dotKey(16, 2),
    dotKey(16, 4),
    dotKey(12, 4),
    dotKey(10, 6),
    dotKey(12, 6),
    dotKey(14, 6),
    dotKey(8, 8),
    dotKey(10, 8),
    dotKey(12, 8),
    dotKey(14, 8),
    dotKey(16, 8),
    dotKey(6, 10),
    dotKey(8, 10),
    dotKey(10, 10),
    dotKey(12, 10),
    dotKey(14, 10),
    dotKey(16, 10),
    dotKey(18, 10),
    dotKey(6, 12),
    dotKey(8, 12),
    dotKey(16, 12),
    dotKey(18, 12),
    dotKey(6, 14),
    dotKey(8, 14),
    dotKey(16, 14),
    dotKey(18, 14),
    dotKey(6, 16),
    dotKey(8, 16),
    dotKey(16, 16),
    dotKey(18, 16),
    dotKey(6, 18),
    dotKey(8, 18),
    dotKey(16, 18),
    dotKey(18, 18),
    dotKey(6, 20),
    dotKey(8, 20),
    dotKey(10, 20),
    dotKey(12, 20),
    dotKey(14, 20),
    dotKey(16, 20),
    dotKey(18, 20)
  ]);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {ICON_DOT_GRID.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.7"
          fill="currentColor"
          opacity={0.1}
        />
      ))}
      {ICON_DOT_GRID.filter(([x, y]) => activeDots.has(dotKey(x, y))).map(([x, y]) => (
        <circle
          key={`active-${x}-${y}`}
          cx={x}
          cy={y}
          r="0.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function HeartMatrixIcon({ className, size = 18 }: MatrixDotIconProps) {
  const reducedMotion = useReducedMotion();
  const suppressRipple = reducedMotion === true;

  return (
    <span className={["dmx-root inline-flex", className].filter(Boolean).join(" ")}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden
        className="block"
      >
        <g transform="translate(0, 1)">
          {ICON_DOT_GRID.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="0.7"
              fill="currentColor"
              opacity={0}
            />
          ))}
          {HEART_MATRIX_ACTIVE.map(([x, y]) => (
            <circle
              key={`active-${x}-${y}`}
              cx={x}
              cy={y}
              r="0.8"
              fill="currentColor"
              className={suppressRipple ? undefined : "dmx-ripple"}
              style={
                suppressRipple
                  ? undefined
                  : ({ "--dmx-ripple-ring": heartRippleRing(x, y) } as CSSProperties)
              }
            />
          ))}
        </g>
      </svg>
    </span>
  );
}

function PackageManagerTabIcon({ manager, className }: { manager: ShadcnPackageManager; className?: string }) {
  const c = className ?? "size-3 shrink-0";
  switch (manager) {
    case "npm":
      return (
        <svg className={c} viewBox="0 0 32 32" aria-hidden>
          <path
            d="m7.415 7.656 17.291.024-.011 17.29h-4.329l.012-12.974h-4.319l-.01 12.964H7.393zM3.207 1.004h-.005a2.2 2.2 0 0 0-2.198 2.198v25.596c0 1.214.984 2.198 2.198 2.198h25.596a2.2 2.2 0 0 0 2.198-2.198V3.202a2.2 2.2 0 0 0-2.198-2.198h-.006z"
            fill="currentColor"
          />
        </svg>
      );
    case "yarn":
      return (
        <svg className={c} viewBox="0 0 32 32" aria-hidden>
          <path
            d="M28.208 24.409a10.5 10.5 0 0 0-3.959 1.822 23.7 23.7 0 0 1-5.835 2.642 1.63 1.63 0 0 1-.983.55 62 62 0 0 1-6.447.577c-1.163.009-1.876-.3-2.074-.776a1.573 1.573 0 0 1 .866-2.074 4 4 0 0 1-.514-.379c-.171-.171-.352-.514-.406-.388-.225.55-.343 1.894-.947 2.5-.83.839-2.4.559-3.328.072-1.019-.541.072-1.813.072-1.813a.73.73 0 0 1-.992-.343 4.85 4.85 0 0 1-.667-2.949 5.37 5.37 0 0 1 1.749-2.895 9.3 9.3 0 0 1 .658-4.4 10.45 10.45 0 0 1 3.165-3.661S6.628 10.747 7.35 8.817c.469-1.262.658-1.253.812-1.308a3.6 3.6 0 0 0 1.452-.857 5.27 5.27 0 0 1 4.41-1.7S15.2 1.4 16.277 2.09a18.4 18.4 0 0 1 1.533 2.886s1.281-.748 1.425-.469a11.33 11.33 0 0 1 .523 6.132 14 14 0 0 1-2.6 5.411c-.135.225 1.551.938 2.615 3.887.983 2.7.108 4.96.262 5.212.027.045.036.063.036.063s1.127.09 3.391-1.308a8.5 8.5 0 0 1 4.277-1.604 1.081 1.081 0 0 1 .469 2.11Z"
            fill="currentColor"
          />
        </svg>
      );
    case "bun":
      return (
        <svg className={c} viewBox="0 0 32 32" aria-hidden>
          <path
            fill="currentColor"
            d="M29 17c0 5.65-5.82 10.23-13 10.23S3 22.61 3 17c0-3.5 2.24-6.6 5.66-8.44S14.21 4.81 16 4.81s3.32 1.54 7.34 3.71C26.76 10.36 29 13.46 29 17"
          />
          <path
            fill="none"
            stroke="currentColor"
            d="M16 27.65c7.32 0 13.46-4.65 13.46-10.65 0-3.72-2.37-7-5.89-8.85-1.39-.75-2.46-1.41-3.37-2l-1.13-.69A6.14 6.14 0 0 0 16 4.35a6.9 6.9 0 0 0-3.3 1.23c-.42.24-.86.51-1.32.8-.87.54-1.83 1.13-3 1.73C4.91 10 2.54 13.24 2.54 17c0 6 6.14 10.65 13.46 10.65Z"
          />
          <ellipse cx="21.65" cy="18.62" fill="currentColor" rx="2.17" ry="1.28" />
          <ellipse cx="10.41" cy="18.62" fill="currentColor" rx="2.17" ry="1.28" />
          <path
            fillRule="evenodd"
            d="M11.43 18.11a2 2 0 1 0-2-2.05 2.05 2.05 0 0 0 2 2.05m9.2 0a2 2 0 1 0-2-2.05 2 2 0 0 0 2 2.05"
            fill="currentColor"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M10.79 16.19a.77.77 0 1 0-.76-.77.76.76 0 0 0 .76.77m9.2 0a.77.77 0 1 0 0-1.53.77.77 0 0 0 0 1.53"
          />
          <path
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.75"
            d="M18.62 19.67a3.3 3.3 0 0 1-1.09 1.75 2.48 2.48 0 0 1-1.5.69 2.53 2.53 0 0 1-1.5-.69 3.28 3.28 0 0 1-1.08-1.75.26.26 0 0 1 .29-.3h4.58a.27.27 0 0 1 .3.3Z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M14.93 5.75a6.1 6.1 0 0 1-2.09 4.62c-.1.09 0 .27.11.22 1.25-.49 2.94-1.94 2.23-4.88-.03-.15-.25-.11-.25.04m.85 0a6 6 0 0 1 .57 5c0 .13.12.24.21.13.83-1 1.54-3.11-.59-5.31-.1-.11-.27.04-.19.17Zm1-.06a6.1 6.1 0 0 1 2.53 4.38c0 .14.21.17.24 0 .34-1.3.15-3.51-2.66-4.66-.12-.02-.21.18-.09.27ZM9.94 9.55a6.27 6.27 0 0 0 3.89-3.33c.07-.13.28-.08.25.07-.64 3-2.79 3.59-4.13 3.51-.14-.01-.14-.21-.01-.25"
          />
        </svg>
      );
    case "pnpm":
      return (
        <svg className={c} viewBox="0 0 32 32" aria-hidden>
          <path
            d="M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z"
            fill="currentColor"
          />
          <path
            d="M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z"
            fill="currentColor"
            opacity={0.4}
          />
        </svg>
      );
  }
}

function MeasuredPackageManagerDotRail({
  managers,
  value,
  onValueChange
}: {
  managers: readonly ShadcnPackageManager[];
  value: ShadcnPackageManager;
  onValueChange: (pm: ShadcnPackageManager) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [{ width, tabRanges }, setGeom] = useState<{
    width: number;
    tabRanges: [number, number][];
  }>({ width: 0, tabRanges: [] });

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail || managers.length === 0) {
      return;
    }
    const r = rail.getBoundingClientRect();
    const ranges: [number, number][] = [];
    for (let i = 0; i < managers.length; i++) {
      const el = tabRefs.current[i];
      if (!el) {
        setGeom({ width: 0, tabRanges: [] });
        return;
      }
      const br = el.getBoundingClientRect();
      ranges.push([br.left - r.left, br.right - r.left]);
    }
    setGeom({ width: r.width, tabRanges: ranges });
  }, [managers]);

  useLayoutEffect(() => {
    measure();
  }, [measure, value, managers]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(rail);
    return () => ro.disconnect();
  }, [measure]);

  const activeIndex = managers.indexOf(value);
  const dotCount =
    width > 0 && tabRanges.length === managers.length
      ? Math.max(54, Math.round(width / PM_TAB_DOT_GAP_PX))
      : 0;

  return (
    <div ref={railRef} className="flex min-w-0 w-max flex-col gap-0">
      <div className="flex min-w-0 flex-wrap items-center gap-0.5 sm:gap-1.5 w-max">
        {managers.map((pm, tabIndex) => {
          const active = value === pm;
          return (
            <button
              key={pm}
              ref={(el) => {
                tabRefs.current[tabIndex] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onValueChange(pm)}
              className={`inline-flex items-center gap-1 rounded-md px-1 text-xs font-medium transition sm:text-[12px] ${active ? "theme-text-strong" : "theme-text-dim hover:text-(--color-fg-muted) focus-visible:outline-none! focus-visible:ring-0!"
                }`}
            >
              <PackageManagerTabIcon manager={pm} />
              {pm}
            </button>
          );
        })}
      </div>
      <div
        className="relative w-full shrink-0"
        style={{ height: PM_TAB_DOT_ROW_H }}
        aria-hidden
      >
        {width > 0 && tabRanges.length === managers.length && dotCount > 0 && activeIndex >= 0
          ? Array.from({ length: dotCount }, (_, i) => {
            const t = (i + 0.5) / dotCount;
            const x = t * width;
            const range = tabRanges[activeIndex]!;
            const lit = x >= range[0] && x <= range[1];
            return (
              <span
                key={i}
                className={`absolute top-1/2 size-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ease-out ${lit ? "bg-(--color-dot-on)" : "bg-(--color-dot-off)"
                  }`}
                style={{ left: `${t * 100}%` }}
              />
            );
          })
          : null}
      </div>
    </div>
  );
}

export interface PackageManagerInstallToolbarProps {
  value: ShadcnPackageManager;
  onValueChange: (pm: ShadcnPackageManager) => void;
  managers?: readonly ShadcnPackageManager[];
  className?: string;
}

export interface PackageManagerInstallCardCopyProps {
  /** When true, shows check instead of copy icon. */
  copied: boolean;
  onCopy: () => void;
  copyAriaLabel?: string;
  copyAriaLabelCopied?: string;
  /** When set, code is highlighted with Shiki (Vesper) and line numbers. */
  highlightLang?: BundledLanguage;
  /** Gutter for 1-based line indices. Install commands default to false via {@link PackageManagerInstallCard}. */
  showCodeLineNumbers?: boolean;
  /**
   * Max height when the code area is collapsed (Tailwind classes only).
   * Overflow uses a bottom fade + Expand; ignored when expanded to {@link CODE_EXPAND_MAX_HEIGHT_CLASS}.
   */
  codeCollapsedMaxHeightClassName?: string;
}

/** Expanded code region cap (scrollable); paired with collapse UX in {@link CodeBlockWithCopy}. */
export const CODE_EXPAND_MAX_HEIGHT_CLASS = "max-h-[80dvh]" as const;

const CODE_COLLAPSED_MAX_DEFAULT = "!max-h-[min(220px,40dvh)]";

export type PackageManagerInstallCardProps = PackageManagerInstallToolbarProps &
  PackageManagerInstallCardCopyProps & {
    /** Install command shown below the toolbar (same string passed to copy is typical). */
    command: string;
    /** Extra classes on the outer rounded shell. */
    shellClassName?: string;
    /** Extra classes on the `<pre>` wrapping the command. */
    codeBlockClassName?: string;
    /**
     * Extra classes on the scrollable code shell (e.g. scrollbar hiding, `min-h-0`).
     * Max height and overflow are handled internally when content overflows (preview + Expand, then cap at 80dvh).
     */
    codeScrollClassName?: string;
  };

export type TitledCodeCopyCardProps = PackageManagerInstallCardCopyProps & {
  title: ReactNode;
  code: string;
  shellClassName?: string;
  codeBlockClassName?: string;
  /**
   * Extra classes on the scrollable code shell (scrollbar hiding, `min-h-0`, etc.).
   * Collapse / expand and vertical max heights are handled internally.
   */
  codeScrollClassName?: string;
  /** Merged onto the wrapper around the code block (e.g. `flex flex-1 min-h-0 flex-col` to fill remaining card height). */
  codeWrapperClassName?: string;
  /** Merged onto the title `<h3>`; defaults to section-style typography. */
  titleClassName?: string;
  /** Rendered at the end of the title row (e.g. a Preview action). */
  titleEnd?: ReactNode;
};

function CodeBlockWithCopy({
  code,
  copied,
  onCopy,
  copyAriaLabel,
  copyAriaLabelCopied,
  codeBlockClassName,
  codeScrollClassName,
  wrapperClassName,
  highlightLang,
  showCodeLineNumbers = true,
  codeCollapsedMaxHeightClassName = CODE_COLLAPSED_MAX_DEFAULT
}: PackageManagerInstallCardCopyProps & {
  code: string;
  codeBlockClassName?: string;
  codeScrollClassName?: string;
  wrapperClassName?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [hasVerticalOverflow, setHasVerticalOverflow] = useState(false);
  const scrollShellRef = useRef<HTMLDivElement>(null);

  const updateOverflow = useCallback(() => {
    const el = scrollShellRef.current;
    if (!el || codeExpanded) {
      return;
    }
    setHasVerticalOverflow(el.scrollHeight > el.clientHeight + 1);
  }, [codeExpanded]);

  useLayoutEffect(() => {
    updateOverflow();
  }, [updateOverflow, code, highlightLang]);

  useLayoutEffect(() => {
    const el = scrollShellRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      updateOverflow();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [updateOverflow]);

  const codeEl = (
    <code
      className={
        codeScrollClassName
          ? "block min-w-0 whitespace-pre"
          : "min-w-0 flex-1 whitespace-pre"
      }
    >
      {code}
    </code>
  );

  const highlightedBody = highlightLang ? (
    <ShikiCodeView
      code={code}
      lang={highlightLang}
      lineNumbers={showCodeLineNumbers}
      className={codeScrollClassName ? "min-h-0 min-w-0" : "min-h-0 min-w-0 flex-1"}
    />
  ) : null;

  const rowClass = [
    "flex gap-2 rounded-md p-2 sm:p-2.5 text-[12px]",
    highlightLang
      ? "bg-(--color-code-bg) theme-text"
      : "bg-(--color-shell) leading-relaxed theme-text",
    codeScrollClassName ? "min-h-0 items-stretch overflow-hidden" : "items-start overflow-x-auto",
    codeBlockClassName
  ]
    .filter(Boolean)
    .join(" ");

  const fadeToClass = highlightLang ? "to-(--color-code-bg)" : "to-(--color-shell)";

  const scrollOrPlain = codeScrollClassName ? (
    <div
      ref={scrollShellRef}
      className={[
        "relative min-h-0 min-w-0 flex-1",
        codeScrollClassName,
        codeExpanded
          ? [CODE_EXPAND_MAX_HEIGHT_CLASS, "overflow-y-auto overflow-x-auto"].join(" ")
          : [
            "!min-h-0",
            codeCollapsedMaxHeightClassName,
            // Beat `overflow-y-*` from `codeScrollClassName` (CSS: longhand can win over `overflow` shorthand).
            "overflow-x-auto !overflow-y-hidden"
          ].join(" ")
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {highlightLang ? highlightedBody : codeEl}
      {!codeExpanded && hasVerticalOverflow ? (
        <>
          <div
            className={[
              "pointer-events-none absolute inset-x-0 bottom-0 h-[80%] bg-linear-to-b from-transparent",
              fadeToClass
            ].join(" ")}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start p-2">
            <button
              type="button"
              aria-label="Expand code"
              onClick={() => {
                setCodeExpanded(true);
              }}
              className="pointer-events-auto rounded-md bg-(--color-surface-raised) px-2 py-1 text-xs font-medium theme-text backdrop-blur-[2px] transition-colors hover:bg-(--color-surface-muted)"
            >
              Expand
            </button>
          </div>
        </>
      ) : null}
    </div>
  ) : highlightLang ? (
    highlightedBody
  ) : (
    codeEl
  );

  const Tag = highlightLang ? "div" : "pre";

  return (
    <div
      className={["px-1 pb-1", wrapperClassName].filter(Boolean).join(" ")}
    >
      <Tag className={rowClass} {...(highlightLang ? { role: "group" as const } : {})}>
        {scrollOrPlain}
        <button
          type="button"
          aria-label={copied ? copyAriaLabelCopied : copyAriaLabel}
          onClick={onCopy}
          className={[
            "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-lg theme-text-strong transition-colors duration-150 ease-out",
            codeScrollClassName ? "self-start" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {shouldReduceMotion ? (
            copied ? (
              <CheckIcon className="" />
            ) : (
              <CopyClipboardIcon className="" />
            )
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "check" : "copy"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {copied ? (
                  <CheckIcon className="" />
                ) : (
                  <CopyClipboardIcon className="" />
                )}
              </motion.span>
            </AnimatePresence>
          )}
        </button>
      </Tag>
    </div>
  );
}

/** Same shell and code row as {@link PackageManagerInstallCard}, with a title strip instead of package tabs. */
export function TitledCodeCopyCard({
  title,
  code,
  shellClassName,
  codeBlockClassName,
  codeScrollClassName,
  codeCollapsedMaxHeightClassName,
  codeWrapperClassName,
  titleClassName,
  titleEnd,
  highlightLang,
  showCodeLineNumbers = true,
  copied,
  onCopy,
  copyAriaLabel = "Copy code",
  copyAriaLabelCopied = "Copied"
}: TitledCodeCopyCardProps) {
  const headingClass =
    titleClassName ??
    "theme-text text-xs";

  return (
    <div
      className={[
        "overflow-hidden rounded-lg bg-(--color-surface-soft)",
        shellClassName
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 shrink-0 items-center justify-between gap-2 rounded-t-lg bg-(--color-surface-soft) py-1.5 pt-2.5 pl-3 pr-2.5">
        <h3 className={["min-w-0 flex-1 truncate", headingClass].filter(Boolean).join(" ")}>{title}</h3>
        {titleEnd}
      </div>
      <CodeBlockWithCopy
        code={code}
        copied={copied}
        onCopy={onCopy}
        copyAriaLabel={copyAriaLabel}
        copyAriaLabelCopied={copyAriaLabelCopied}
        codeBlockClassName={codeBlockClassName}
        codeScrollClassName={codeScrollClassName}
        codeCollapsedMaxHeightClassName={codeCollapsedMaxHeightClassName}
        wrapperClassName={codeWrapperClassName}
        highlightLang={highlightLang}
        showCodeLineNumbers={showCodeLineNumbers}
      />
    </div>
  );
}

export function PackageManagerInstallToolbar({
  value,
  onValueChange,
  managers = SHADCN_PACKAGE_MANAGERS,
  className
}: PackageManagerInstallToolbarProps) {
  return (
    <div
      className={[
        "flex items-center gap-1 rounded-t-lg bg-(--color-surface-soft) px-3 py-1.5 pt-2.5",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MeasuredPackageManagerDotRail
        managers={managers}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}

export function PackageManagerInstallCard({
  command,
  shellClassName,
  codeBlockClassName,
  codeScrollClassName,
  codeCollapsedMaxHeightClassName,
  copied,
  onCopy,
  copyAriaLabel = "Copy install command",
  copyAriaLabelCopied = "Copied",
  highlightLang = "bash",
  showCodeLineNumbers = false,
  ...toolbarProps
}: PackageManagerInstallCardProps) {
  return (
    <div
      className={[
        "overflow-hidden rounded-lg bg-(--color-surface-soft)",
        shellClassName
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PackageManagerInstallToolbar {...toolbarProps} />
      <CodeBlockWithCopy
        code={command}
        copied={copied}
        onCopy={onCopy}
        copyAriaLabel={copyAriaLabel}
        copyAriaLabelCopied={copyAriaLabelCopied}
        codeBlockClassName={codeBlockClassName}
        codeScrollClassName={codeScrollClassName}
        codeCollapsedMaxHeightClassName={codeCollapsedMaxHeightClassName}
        highlightLang={highlightLang}
        showCodeLineNumbers={showCodeLineNumbers}
      />
    </div>
  );
}
