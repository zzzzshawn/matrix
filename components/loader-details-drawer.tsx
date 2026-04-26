"use client";

import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  PackageManagerInstallCard,
  TitledCodeCopyCard,
  shadcnRegistryAddCommand,
  type ShadcnPackageManager
} from "@/components/package-manager-install-toolbar";
import { HIDE_CODE_SCROLLBARS } from "@/lib/hide-code-scrollbar-class";
import { LoaderPropsReference } from "@/lib/loader-props-reference";
import { usePrefersReducedMotion } from "@/loaders/hooks/use-prefers-reduced-motion";
import { GeistPixelCircle } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

const CLI_MANUAL_DOT_ROW_H = 6;
const CLI_MANUAL_DOT_GAP_PX = 9;

/** Shiki / install command blocks: scrollbar hiding + min height; collapse / expand and max heights are handled in the install toolbar code shell. */
const DIALOG_CODE_SCROLL_CLASS = ["min-h-0", HIDE_CODE_SCROLLBARS].join(" ");

/** Flat index (row-major 5×5): chase order along main diag then anti-diag (center once). */
const CLOSE_CROSS_CHASE_ORDER: Record<number, number> = {
  0: 0,
  6: 1,
  12: 2,
  18: 3,
  24: 4,
  16: 5,
  20: 6,
  8: 7,
  4: 8
};

const MemoLoaderPropsReference = memo(LoaderPropsReference);

const ExampleUsageDotRail = memo(function ExampleUsageDotRail() {
  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {Array.from({ length: 150 }).map((_, i) => (
        <div key={i} className="size-0.5 shrink-0 rounded-full bg-dot-faint" />
      ))}
    </div>
  );
});

const DrawerPreviewPane = memo(function DrawerPreviewPane({
  selected,
  preview
}: {
  selected: LoaderCard | null;
  preview: ReactNode;
}) {
  if (!selected) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg">
      <h2
        className={`${GeistPixelCircle.className} theme-text-strong shrink-0 px-4 pt-4 text-left text-base font-semibold tracking-tight`}
      >
        {selected.title}
      </h2>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {preview}
      </div>
    </section>
  );
});

const FloatingCloseCrossDots = memo(function FloatingCloseCrossDots() {
  const reducedMotion = usePrefersReducedMotion();
  const stepMs = 70;

  return (
    <span className="grid grid-cols-5 gap-px" aria-hidden>
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const isCross = row === col || row + col === 4;
        if (!isCross) {
          return <span key={index} className="h-[3px] w-[3px] rounded-full bg-dot-faint" />;
        }
        if (reducedMotion) {
          return <span key={index} className="h-[3px] w-[3px] rounded-full bg-dot-on" />;
        }
        const order = CLOSE_CROSS_CHASE_ORDER[index] ?? 0;
        return (
          <span
            key={index}
            className="h-[3px] w-[3px] rounded-full bg-dot-on motion-safe:animate-close-cross-dot"
            style={{ animationDelay: `${(order * stepMs) / 1000}s` }}
          />
        );
      })}
    </span>
  );
});

const MeasuredCliManualDotRail = memo(function MeasuredCliManualDotRail({
  activeTab,
  onTabChange
}: {
  activeTab: "cli" | "manual";
  onTabChange: (tab: "cli" | "manual") => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const cliRef = useRef<HTMLButtonElement>(null);
  const manualRef = useRef<HTMLButtonElement>(null);
  const [{ width, cli, manual }, setGeom] = useState<{
    width: number;
    cli: [number, number] | null;
    manual: [number, number] | null;
  }>({ width: 0, cli: null, manual: null });

  const measure = useCallback(() => {
    const rail = railRef.current;
    const c = cliRef.current;
    const m = manualRef.current;
    if (!rail || !c || !m) {
      return;
    }
    const r = rail.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    const mr = m.getBoundingClientRect();
    setGeom({
      width: r.width,
      cli: [cr.left - r.left, cr.right - r.left],
      manual: [mr.left - r.left, mr.right - r.left]
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, activeTab]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(rail);
    return () => ro.disconnect();
  }, [measure]);

  const dotCount = width > 0 ? Math.max(25, Math.round(width / CLI_MANUAL_DOT_GAP_PX)) : 0;

  return (
    <div ref={railRef} className="inline-flex flex-col items-stretch gap-0 w-max">
      <div className="inline-flex gap-0">
        <button
          ref={cliRef}
          type="button"
          onClick={() => onTabChange("cli")}
          className={`rounded-lg pr-2 pl-1.5 text-xs font-medium transition ${activeTab === "cli" ? "text-fg-strong" : "text-fg-muted hover:text-fg"
            }`}
        >
          CLI
        </button>
        <button
          ref={manualRef}
          type="button"
          onClick={() => onTabChange("manual")}
          className={`rounded-lg pl-2 pr-1.5 text-xs font-medium transition ${activeTab === "manual" ? "text-fg-strong" : "text-fg-muted hover:text-fg"
            }`}
        >
          Manual
        </button>
      </div>
      <div
        className="relative shrink-0"
        style={{ height: CLI_MANUAL_DOT_ROW_H }}
        aria-hidden
      >
        {width > 0 && cli && manual && dotCount > 0
          ? Array.from({ length: dotCount }, (_, i) => {
            const t = (i + 0.5) / dotCount;
            const x = t * width;
            const inCli = x >= cli[0] && x <= cli[1];
            const inManual = x >= manual[0] && x <= manual[1];
            const lit = activeTab === "cli" ? inCli : inManual;
            return (
              <span
                key={i}
                className={`absolute top-1/2 size-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ease-out ${lit ? "bg-dot-on" : "bg-dot-off"
                  }`}
                style={{ left: `${t * 100}%` }}
              />
            );
          })
          : null}
      </div>
    </div>
  );
});

export interface LoaderCard {
  slug: string;
  title: string;
  description: string;
  componentName: string;
  motionOptional: boolean;
  sourceCode: string;
}

export interface ManualSetupSources {
  coreFilePath: string;
  coreSource: string;
  hooksFilePath: string;
  hooksSource: string;
  cssFilePath: string;
  cssSource: string;
}

export type ExamplePreviewId = "ex-opacity" | "ex-layout" | "ex-look";

interface LoaderDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: LoaderCard | null;
  preview: ReactNode;
  activeExamplePreviewId: ExamplePreviewId | null;
  onExamplePreview: (id: ExamplePreviewId) => void;
}

export function LoaderDetailsDrawer({
  open,
  onOpenChange,
  selected,
  preview,
  activeExamplePreviewId,
  onExamplePreview
}: LoaderDetailsDrawerProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cli" | "manual">("cli");
  const [packageManager, setPackageManager] = useState<ShadcnPackageManager>("pnpm");
  const scopedRegistryName = "@dotmatrix";
  const scopedItemName = selected ? `${scopedRegistryName}/${selected.slug}` : "";
  const installCommand = selected ? shadcnRegistryAddCommand(packageManager, scopedItemName) : "";
  const demoUsageCode = selected
    ? `import { ${selected.componentName} } from "@/components/ui/${selected.slug}";

export function Example() {
  return <${selected.componentName} />;
}`
    : "";

  const propExampleCards = useMemo(() => {
    if (!selected) {
      return [];
    }
    const C = selected.componentName;
    const from = selected.slug;
    const isSquareMatrix = from.startsWith("dotm-square-");
    const isTriangleMatrix = from.startsWith("dotm-triangle-");
    const opacityItem = isTriangleMatrix
      ? {
        id: "ex-opacity" as const,
        title: "Size & speed",
        copyToken: "example-usage-opacity" as const,
        code: `import { ${C} } from "@/components/ui/${from}";

export function SizeAndSpeed() {
  return (
    <${C}
      size={32}
      dotSize={4}
      speed={1.4}
    />
  );
}`
      }
      : {
        id: "ex-opacity" as const,
        title: "Opacity & speed",
        copyToken: "example-usage-opacity" as const,
        code: `import { ${C} } from "@/components/ui/${from}";

export function OpacityAndSpeed() {
  return (
    <${C}
      size={32}
      dotSize={4}
      speed={1.4}
      opacityBase={0.1}
      opacityMid={0.4}
      opacityPeak={0.95}
    />
  );
}`
      };
    const layoutItem = {
      id: "ex-layout" as const,
      title: "Fixed gap & box slot",
      copyToken: "example-usage-layout" as const,
      code: `import { ${C} } from "@/components/ui/${from}";

export function LayoutSlot() {
  return (
    <${C}
      dotSize={3}
      cellPadding={2}
      boxSize={64}
      minSize={48}
    />
  );
}`
    };
    return [
      opacityItem,
      ...(isTriangleMatrix ? [] : [layoutItem]),
      {
        id: "ex-look" as const,
        title: isSquareMatrix ? "Pattern & look" : "Color & look",
        copyToken: "example-usage-look" as const,
        code: isSquareMatrix
          ? `import { ${C} } from "@/components/ui/${from}";

export function PatternAndLook() {
  return (
    <${C}
      pattern="cross"
      color="var(--color-dotmatrix)"
      speed={0.8}
      muted
      animated
    />
  );
}`
          : `import { ${C} } from "@/components/ui/${from}";

export function ColorAndLook() {
  return (
    <${C}
      color="var(--color-dotmatrix)"
      muted
    />
  );
}`
      }
    ];
  }, [selected]);

  useEffect(() => {
    setActiveTab("cli");
    setPackageManager("pnpm");
  }, [selected?.slug]);

  const copySnippet = useCallback(async (token: string, content: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedToken(token);
      window.setTimeout(() => {
        setCopiedToken((prev) => (prev === token ? null : prev));
      }, 1400);
    } catch {
      // Ignore copy failures in unsupported environments.
    }
  }, []);

  const exampleUsageCardList = useMemo(
    () => (
      <div className="grid gap-3">
        <p className="theme-text-strong text-base font-semibold tracking-tight">Example usage</p>
        {propExampleCards.map((card) => {
          const active = activeExamplePreviewId === card.id;
          return (
            <TitledCodeCopyCard
              key={card.id}
              title={card.title}
              titleEnd={
                <button
                  type="button"
                  onClick={() => onExamplePreview(card.id)}
                  className={[
                    "theme-text shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium tabular-nums transition",
                    "focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(--focus-ring)",
                    active
                      ? "border-border bg-shell-overlay"
                      : "border-transparent bg-code-bg hover:text-link-hover"
                  ].join(" ")}
                  aria-pressed={active}
                >
                  Preview
                </button>
              }
              code={card.code}
              highlightLang="tsx"
              copied={copiedToken === card.copyToken}
              onCopy={() => copySnippet(card.copyToken, card.code)}
              copyAriaLabel={`Copy ${card.title} example`}
              codeBlockClassName={HIDE_CODE_SCROLLBARS}
              codeScrollClassName={DIALOG_CODE_SCROLL_CLASS}
              titleClassName="theme-text min-w-0 text-left text-xs font-medium normal-case tracking-normal"
              showCodeLineNumbers={false}
            />
          );
        })}
      </div>
    ),
    [activeExamplePreviewId, copiedToken, copySnippet, onExamplePreview, propExampleCards]
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-backdrop backdrop-blur-[7px] transition-opacity duration-190 ease-[cubic-bezier(.215, .61, .355, 1)] data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50">
          <Dialog.Popup
            className={`${GeistSans.className} absolute inset-y-2 left-2 hidden h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(50%-0.75rem)] flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-lg bg-surface transition-transform duration-190 ease-[cubic-bezier(.215, .61, .355, 1)] data-starting-style:-translate-x-full data-ending-style:-translate-x-full md:flex`}
          >
            <DrawerPreviewPane selected={selected} preview={preview} />
          </Dialog.Popup>
          <Dialog.Popup
            className={`${GeistSans.className} absolute inset-y-2 left-2 right-2 flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] min-h-0 w-auto flex-col overflow-hidden rounded-lg bg-surface transition-transform duration-190 ease-[cubic-bezier(.215, .61, .355, 1)] data-starting-style:translate-x-full data-ending-style:translate-x-full md:left-auto md:right-2 md:w-[calc(50%-0.75rem)] `}
          >
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-16 backdrop-blur-[2px]"
              style={{
                backgroundImage: "var(--drawer-fade)",
                WebkitMaskImage: "linear-gradient(to top, var(--color-fg-strong) 0%, var(--color-fg-strong) 40%, transparent 100%)",
                maskImage: "linear-gradient(to top, var(--color-fg-strong) 0%, var(--color-fg-strong) 40%, transparent 100%)"
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-30 backdrop-blur-[3px]"
              style={{
                backgroundImage: "var(--drawer-fade)",
                WebkitMaskImage: "linear-gradient(to top, var(--color-fg-strong) 0%, var(--color-fg-strong) 40%, transparent 100%)",
                maskImage: "linear-gradient(to top, var(--color-fg-strong) 0%, var(--color-fg-strong) 40%, transparent 100%)"
              }}
            />



            {selected ? (
              <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-hidden sm:px-1.5">
                <div className="shrink-0 px-4 pt-4">
                  <MeasuredCliManualDotRail activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
                <section className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-2 pb-6">
                  {activeTab === "cli" ? (
                    <div className="grid gap-4">
                      <PackageManagerInstallCard
                        value={packageManager}
                        onValueChange={setPackageManager}
                        copied={copiedToken === "install-command"}
                        onCopy={() => copySnippet("install-command", installCommand)}
                        command={installCommand}
                        codeBlockClassName={HIDE_CODE_SCROLLBARS}
                        codeScrollClassName={DIALOG_CODE_SCROLL_CLASS}
                      />
                      <TitledCodeCopyCard
                        title="Demo Usage"
                        code={demoUsageCode}
                        highlightLang="tsx"
                        copied={copiedToken === "demo-usage"}
                        onCopy={() => copySnippet("demo-usage", demoUsageCode)}
                        copyAriaLabel="Copy demo usage"
                        codeBlockClassName={HIDE_CODE_SCROLLBARS}
                        codeScrollClassName={DIALOG_CODE_SCROLL_CLASS}
                      />

                      <ExampleUsageDotRail />
                      {exampleUsageCardList}
                      <MemoLoaderPropsReference slug={selected.slug} sourceCode={selected.sourceCode} />
                    </div>
                  ) : (
                    <div className="flex min-h-0 flex-col gap-4">
                      <div className="grid shrink-0 gap-1">
                        <h3 className="theme-text text-lg">
                          Manual Usage
                        </h3>
                        <p className="theme-text text-sm leading-relaxed">
                          You need to manually create the shared runtime files before using individual loaders. Follow the{" "}
                          <Link
                            href="/getting-started/manual"
                            className="theme-link underline underline-offset-4"
                          >
                            Getting Started Manually
                          </Link>{" "}
                          guide first.
                        </p>
                      </div>
                      <TitledCodeCopyCard
                        title={`components/ui/${selected.slug}.tsx`}
                        titleClassName="theme-text-dim truncate text-left font-mono text-xs font-medium normal-case tracking-normal"
                        code={selected.sourceCode}
                        highlightLang="tsx"
                        shellClassName="flex min-h-0 flex-col"
                        codeWrapperClassName="flex min-h-0 flex-col"
                        codeBlockClassName="min-h-0"
                        codeScrollClassName={DIALOG_CODE_SCROLL_CLASS}
                        copied={copiedToken === "loader-source"}
                        onCopy={() => copySnippet("loader-source", selected.sourceCode)}
                        copyAriaLabel="Copy loader source"
                      />
                      {exampleUsageCardList}
                      <MemoLoaderPropsReference slug={selected.slug} sourceCode={selected.sourceCode} />
                    </div>
                  )}
                </section>
              </div>
            ) : null}
          </Dialog.Popup>
          <AnimatePresence>
            {open ? (
              <motion.div
                key="floating-close"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.08 } }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-none absolute inset-x-0 bottom-1 z-50 flex justify-center"
              >
                <Dialog.Close
                  aria-label="Close dialog"
                  className="pointer-events-auto inline-grid place-items-center rounded-lg bg-bg p-2.5 text-fg-strong"
                >
                  <FloatingCloseCrossDots />
                </Dialog.Close>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
