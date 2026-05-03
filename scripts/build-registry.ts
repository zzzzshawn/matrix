import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { LOADER_GALLERY_PREVIEW_PROPS } from "../lib/loader-gallery-preview-props";
import { loaderRegistry } from "../lib/registry-config";

interface RegistryFile {
  path: string;
  type: "registry:ui" | "registry:lib" | "registry:style";
  content: string;
}

const docsRoot = process.cwd();
const loadersRoot = path.join(docsRoot, "loaders");
const manualRoot = path.join(loadersRoot, "manual");
const publicRegistryDir = path.join(docsRoot, "public", "r");
const fallbackHomepage = "https://dotmatrix.zzzzshawn.cloud";
const registryName = "@dotmatrix";
const allRegistryItemName = "all";

const sharedSourceFiles: Array<{ absolutePath: string; targetPath: string; type: RegistryFile["type"] }> = [
  {
    absolutePath: path.join(manualRoot, "dotmatrix-core.tsx"),
    targetPath: "components/ui/dotmatrix-core.tsx",
    type: "registry:lib"
  },
  {
    absolutePath: path.join(manualRoot, "dotmatrix-hooks.ts"),
    targetPath: "components/ui/dotmatrix-hooks.ts",
    type: "registry:lib"
  },
  {
    absolutePath: path.join(loadersRoot, "styles.css"),
    targetPath: "components/dotmatrix-loader.css",
    type: "registry:style"
  }
];

async function readSource(relativePath: string): Promise<string> {
  return readFile(path.join(loadersRoot, relativePath), "utf-8");
}

async function readAbsolute(filePath: string): Promise<string> {
  return readFile(filePath, "utf-8");
}

async function writeRegistrySource(pathInRegistry: string, content: string): Promise<void> {
  const absolutePath = path.join(publicRegistryDir, pathInRegistry);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, "utf-8");
}

const importRewrites: ReadonlyArray<{ from: string; to: string }> = [
  { from: "../base/dot-matrix-base", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/circle-mask", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/cx", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/grid-paths", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/hydration-inline-style", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/opacity-triplet", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/dmx-dot-bloom", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/path-wave-factory", to: "@/components/ui/dotmatrix-core" },
  { from: "../core/patterns", to: "@/components/ui/dotmatrix-core" },
  { from: "../types", to: "@/components/ui/dotmatrix-core" },
  { from: "../hooks/use-cycle-phase", to: "@/components/ui/dotmatrix-hooks" },
  { from: "../hooks/use-stepped-cycle", to: "@/components/ui/dotmatrix-hooks" },
  { from: "../hooks/use-prefers-reduced-motion", to: "@/components/ui/dotmatrix-hooks" },
  { from: "../core/phases", to: "@/components/ui/dotmatrix-hooks" }
];

/** shadcn installs all files under components/ui/; use the default ui alias so paths resolve in consumer apps. */
function rewriteRegistrySharedCrossImports(source: string): string {
  return source
    .replaceAll('from "./dotmatrix-core"', 'from "@/components/ui/dotmatrix-core"')
    .replaceAll('from "./dotmatrix-hooks"', 'from "@/components/ui/dotmatrix-hooks"');
}

function formatDefaultLiteral(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  return null;
}

function applyParamDefaults(
  source: string,
  defaults: Partial<Record<"size" | "dotSize" | "pattern" | "animated" | "speed", unknown>>
): string {
  const fnMatch = source.match(
    /export function \w+\(\{\n([\s\S]*?)\n\}: [\w<>{}\[\]\s|&?,.]+?\) \{/
  );
  if (!fnMatch?.[1]) {
    return source;
  }

  const paramsBlock = fnMatch[1];
  const lines = paramsBlock.split("\n");
  const keys: Array<keyof typeof defaults> = ["size", "dotSize", "pattern", "animated", "speed"];

  let changed = false;
  const nextLines = lines.map((line) => {
    const propMatch = line.match(/^(\s*)([A-Za-z_]\w*)(\s*=\s*[^,]+)?(,?)$/);
    if (!propMatch) {
      return line;
    }
    const [, indent, name, , comma] = propMatch;
    const key = name as keyof typeof defaults;
    if (!keys.includes(key)) {
      return line;
    }
    const literal = formatDefaultLiteral(defaults[key]);
    if (literal == null) {
      return line;
    }
    changed = true;
    return `${indent}${name} = ${literal}${comma || ","}`;
  });

  if (!changed) {
    return source;
  }

  return source.replace(paramsBlock, nextLines.join("\n"));
}

function applyDotMatrixBaseRestDefaults(
  source: string,
  defaults: Partial<Record<"size" | "dotSize", unknown>>
): string {
  const hasRest = /\.\.\.rest/.test(source);
  const hasDotMatrixBase = /<DotMatrixBase/.test(source);
  if (!hasRest || !hasDotMatrixBase) {
    return source;
  }

  let injected = source;
  const sizeLiteral = formatDefaultLiteral(defaults.size);
  const dotSizeLiteral = formatDefaultLiteral(defaults.dotSize);

  if (sizeLiteral != null && !/size=\{rest\.size \?\?/.test(injected)) {
    injected = injected.replace(
      /<DotMatrixBase\s*\n\s*\{\.\.\.rest\}/,
      (match) => `${match}\n      size={rest.size ?? ${sizeLiteral}}`
    );
  }

  if (dotSizeLiteral != null && !/dotSize=\{rest\.dotSize \?\?/.test(injected)) {
    injected = injected.replace(
      /<DotMatrixBase\s*\n\s*\{\.\.\.rest\}(?:\n\s*size=\{rest\.size \?\? [^\n]+\})?/,
      (match) => `${match}\n      dotSize={rest.dotSize ?? ${dotSizeLiteral}}`
    );
  }

  return injected;
}

function applyInstallDefaults(source: string, slug: string): string {
  const defaults = LOADER_GALLERY_PREVIEW_PROPS[slug];
  if (!defaults) {
    return source;
  }

  const withParamDefaults = applyParamDefaults(source, {
    size: defaults.size,
    dotSize: defaults.dotSize,
    pattern: defaults.pattern,
    animated: defaults.animated,
    speed: defaults.speed
  });

  return applyDotMatrixBaseRestDefaults(withParamDefaults, {
    size: defaults.size,
    dotSize: defaults.dotSize
  });
}

async function build() {
  await rm(publicRegistryDir, { recursive: true, force: true });
  await mkdir(publicRegistryDir, { recursive: true });

  const sharedSources = await Promise.all(
    sharedSourceFiles.map(async (sharedFile) => {
      let content = await readAbsolute(sharedFile.absolutePath);
      if (sharedFile.type !== "registry:style") {
        content = rewriteRegistrySharedCrossImports(content);
      }
      return { ...sharedFile, content };
    })
  );

  const loaderRegistryItems = await Promise.all(
    loaderRegistry.map(async (loader) => {
      const files: RegistryFile[] = [];

      const componentSource = applyInstallDefaults(
        rewriteRegistrySharedCrossImports(
          importRewrites.reduce(
            (current, { from, to }) => current.replaceAll(`"${from}"`, `"${to}"`),
            await readSource(path.join("loaders", loader.fileName))
          )
        ),
        loader.slug
      );
      const componentPath = `components/ui/${loader.fileName}`;
      files.push({
        path: componentPath,
        type: "registry:ui",
        content: componentSource
      });
      await writeRegistrySource(componentPath, componentSource);

      for (const sharedFile of sharedSources) {
        await writeRegistrySource(sharedFile.targetPath, sharedFile.content);
        files.push({
          path: sharedFile.targetPath,
          type: sharedFile.type,
          content: sharedFile.content
        });
      }

      const item = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: loader.slug,
        type: "registry:ui",
        title: loader.title,
        description: loader.description,
        dependencies: loader.dependencies,
        registryDependencies: [],
        meta: {
          animation: loader.motionOptional ? "css + optional motion" : "css-only"
        },
        files
      };

      await writeFile(
        path.join(publicRegistryDir, `${loader.slug}.json`),
        JSON.stringify(item, null, 2) + "\n",
        "utf-8"
      );

      await writeFile(path.join(publicRegistryDir, `${loader.slug}.tsx`), componentSource, "utf-8");

      return {
        files,
        name: loader.slug,
        type: "registry:ui",
        title: loader.title,
        description: loader.description,
        dependencies: loader.dependencies,
        registryDependencies: [],
        url: `/r/${loader.slug}.json`
      };
    })
  );

  const allFilesByPath = new Map<string, RegistryFile>();
  for (const loaderItem of loaderRegistryItems) {
    for (const file of loaderItem.files) {
      if (!allFilesByPath.has(file.path)) {
        allFilesByPath.set(file.path, file);
      }
    }
  }

  const allRegistryFiles = [...allFilesByPath.values()];
  const allItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: allRegistryItemName,
    type: "registry:ui",
    title: "All Dot Matrix Loaders",
    description: "Installs every Dot Matrix loader and shared runtime files in one command.",
    dependencies: [],
    registryDependencies: [],
    meta: {
      animation: "css-only + optional motion"
    },
    files: allRegistryFiles
  };

  await writeFile(
    path.join(publicRegistryDir, `${allRegistryItemName}.json`),
    JSON.stringify(allItem, null, 2) + "\n",
    "utf-8"
  );

  const registryItems = [
    ...loaderRegistryItems.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
      url: item.url
    })),
    {
      name: allRegistryItemName,
      type: "registry:ui",
      title: allItem.title,
      description: allItem.description,
      dependencies: allItem.dependencies,
      registryDependencies: allItem.registryDependencies,
      url: `/r/${allRegistryItemName}.json`
    }
  ];

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registryName,
    homepage: process.env.REGISTRY_HOMEPAGE ?? fallbackHomepage,
    items: registryItems
  };

  await writeFile(
    path.join(docsRoot, "registry.json"),
    JSON.stringify(registry, null, 2) + "\n",
    "utf-8"
  );

  await writeFile(
    path.join(publicRegistryDir, "index.json"),
    JSON.stringify(registryItems, null, 2) + "\n",
    "utf-8"
  );

  await writeFile(
    path.join(publicRegistryDir, "registry.json"),
    JSON.stringify(registry, null, 2) + "\n",
    "utf-8"
  );
}

void build();
