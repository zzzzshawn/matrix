import { readFile } from "node:fs/promises";
import path from "node:path";

const loadersRoot = path.join(process.cwd(), "loaders");
const manualRoot = path.join(loadersRoot, "manual");

export interface ManualSetupSources {
  coreFilePath: string;
  coreSource: string;
  hooksFilePath: string;
  hooksSource: string;
  cssFilePath: string;
  cssSource: string;
}

const importRewrites: ReadonlyArray<{ from: string; to: string }> = [
  { from: "../base/dot-matrix-base", to: "./dotmatrix-core" },
  { from: "../core/circle-mask", to: "./dotmatrix-core" },
  { from: "../core/cx", to: "./dotmatrix-core" },
  { from: "../core/grid-paths", to: "./dotmatrix-core" },
  { from: "../core/hydration-inline-style", to: "./dotmatrix-core" },
  { from: "../core/path-wave-factory", to: "./dotmatrix-core" },
  { from: "../core/patterns", to: "./dotmatrix-core" },
  { from: "../types", to: "./dotmatrix-core" },
  { from: "../hooks/use-cycle-phase", to: "./dotmatrix-hooks" },
  { from: "../hooks/use-stepped-cycle", to: "./dotmatrix-hooks" },
  { from: "../hooks/use-prefers-reduced-motion", to: "./dotmatrix-hooks" },
  { from: "../core/phases", to: "./dotmatrix-hooks" }
];

export async function getLoaderSource(fileName: string): Promise<string> {
  const source = await readFile(path.join(loadersRoot, "loaders", fileName), "utf-8");
  return importRewrites.reduce((current, { from, to }) => {
    return current.replaceAll(`"${from}"`, `"${to}"`);
  }, source);
}

export async function getManualSetupSources(): Promise<ManualSetupSources> {
  const [coreSource, hooksSource, cssSource] = await Promise.all([
    readFile(path.join(manualRoot, "dotmatrix-core.tsx"), "utf-8"),
    readFile(path.join(manualRoot, "dotmatrix-hooks.ts"), "utf-8"),
    readFile(path.join(loadersRoot, "styles.css"), "utf-8")
  ]);

  return {
    coreFilePath: "components/ui/dotmatrix-core.tsx",
    coreSource,
    hooksFilePath: "components/ui/dotmatrix-hooks.ts",
    hooksSource,
    cssFilePath: "styles/dotmatrix-loader.css",
    cssSource
  };
}

export async function getSharedCssSource(): Promise<string> {
  return readFile(path.join(loadersRoot, "styles.css"), "utf-8");
}
