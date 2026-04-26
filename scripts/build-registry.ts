import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { loaderRegistry } from "../lib/registry-config";

interface RegistryFile {
  path: string;
  type: "registry:ui" | "registry:lib" | "registry:style";
}

const docsRoot = process.cwd();
const loadersRoot = path.join(docsRoot, "loaders");
const manualRoot = path.join(loadersRoot, "manual");
const publicRegistryDir = path.join(docsRoot, "public", "r");
const fallbackHomepage = "https://dotmatrix-registry.example.com";

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
    targetPath: "styles/dotmatrix-loader.css",
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

async function build() {
  await rm(publicRegistryDir, { recursive: true, force: true });
  await mkdir(publicRegistryDir, { recursive: true });

  const registryItems = await Promise.all(
    loaderRegistry.map(async (loader) => {
      const files: RegistryFile[] = [];

      const componentSource = importRewrites.reduce(
        (current, { from, to }) => current.replaceAll(`"${from}"`, `"${to}"`),
        await readSource(path.join("loaders", loader.fileName))
      );
      const componentPath = `components/ui/${loader.fileName}`;
      files.push({
        path: componentPath,
        type: "registry:ui"
      });
      await writeRegistrySource(componentPath, componentSource);

      for (const sharedFile of sharedSourceFiles) {
        await writeRegistrySource(sharedFile.targetPath, await readAbsolute(sharedFile.absolutePath));
        files.push({
          path: sharedFile.targetPath,
          type: sharedFile.type
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

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "dotmatrix-loaders",
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
