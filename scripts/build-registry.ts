import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

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

  const registryItems = await Promise.all(
    loaderRegistry.map(async (loader) => {
      const files: RegistryFile[] = [];

      const componentSource = rewriteRegistrySharedCrossImports(
        importRewrites.reduce(
          (current, { from, to }) => current.replaceAll(`"${from}"`, `"${to}"`),
          await readSource(path.join("loaders", loader.fileName))
        )
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
